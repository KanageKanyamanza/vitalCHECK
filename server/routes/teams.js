const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Team = require('../models/Team');
const TeamInvite = require('../models/TeamInvite');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const { authenticateClient } = require('../middleware/auth');
const { sendTeamInviteEmail } = require('../utils/emailService');

const PREMIUM_PLANS = ['premium', 'diagnostic'];
const INVITE_TTL_HOURS = 48;

// Helper: verify the caller belongs to the given team
const requireTeamMember = (req, res) => {
  const team = req.user?.team;
  if (!team) {
    res.status(404).json({ message: 'Équipe introuvable', code: 'TEAM_NOT_FOUND' });
    return null;
  }
  return team;
};

// Helper: verify the caller is the team owner
const requireTeamOwner = (team, req, res) => {
  if (String(team.owner) !== String(req.user._id) &&
      String(team.owner?._id) !== String(req.user._id)) {
    res.status(403).json({ message: 'Action réservée au propriétaire de l\'équipe', code: 'OWNER_REQUIRED' });
    return false;
  }
  return true;
};

// Helper: team has multi-user premium access
const teamHasPremiumMulti = (team) => {
  const sub = team.subscription;
  return (
    sub?.status === 'active' &&
    PREMIUM_PLANS.includes(sub?.plan) &&
    (!sub?.endDate || new Date(sub.endDate) > new Date())
  );
};

// ── GET /api/teams/me ─────────────────────────────────────────────────────────
// Team info + member list (owner + member)
// Auto-creates a personal team if the user has none (handles accounts pre-migration)
router.get('/me', authenticateClient, async (req, res) => {
  try {
    let teamId = req.user.team?._id || req.user.team;

    // Auto-create personal team if missing (idempotent safety net)
    if (!teamId) {
      const plan = req.user.subscription?.plan || 'free';
      const newTeam = await Team.create({
        name: req.user.companyName || req.user.email,
        owner: req.user._id,
        members: [{ user: req.user._id, role: 'owner', joinedAt: req.user.createdAt || new Date() }],
        subscription: req.user.subscription || { plan: 'free', status: 'inactive' },
        maxMembers: ['premium', 'diagnostic'].includes(plan) ? 5 : 1,
        createdAt: req.user.createdAt || new Date(),
      });
      await User.findByIdAndUpdate(req.user._id, { team: newTeam._id });
      teamId = newTeam._id;
    }

    const team = await Team.findById(teamId)
      .populate('owner', 'firstName lastName email companyName')
      .populate('members.user', 'firstName lastName email companyName lastLogin');

    if (!team) return res.status(404).json({ message: 'Équipe introuvable' });

    // Security: verify caller is actually in the team
    const isMember = team.members.some(m => String(m.user?._id || m.user) === String(req.user._id));
    if (!isMember) return res.status(403).json({ message: 'Accès refusé' });

    res.json({
      team: {
        _id: team._id,
        name: team.name,
        subscription: team.subscription,
        maxMembers: team.maxMembers,
        hasPremiumMulti: teamHasPremiumMulti(team),
        isOwner: String(team.owner?._id || team.owner) === String(req.user._id),
        owner: {
          _id: team.owner._id,
          name: team.owner.companyName || `${team.owner.firstName || ''} ${team.owner.lastName || ''}`.trim(),
          email: team.owner.email,
        },
        members: team.members.map(m => ({
          _id: m.user?._id,
          name: m.user?.companyName || `${m.user?.firstName || ''} ${m.user?.lastName || ''}`.trim(),
          email: m.user?.email,
          role: m.role,
          joinedAt: m.joinedAt,
          lastLogin: m.user?.lastLogin,
        })),
      },
    });
  } catch (err) {
    console.error('[teams/me]', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ── POST /api/teams/invite ────────────────────────────────────────────────────
// Send invitation (owner + premium multi only)
router.post('/invite', authenticateClient, async (req, res) => {
  try {
    const team = requireTeamMember(req, res);
    if (!team) return;

    const fullTeam = await Team.findById(team._id || team);
    if (!requireTeamOwner(fullTeam, req, res)) return;

    if (!teamHasPremiumMulti(fullTeam)) {
      return res.status(403).json({
        message: 'L\'accès multi-membres nécessite un abonnement Premium actif',
        code: 'PREMIUM_REQUIRED',
      });
    }

    // maxMembers counts members only (owner excluded)
    const currentMemberCount = fullTeam.members.filter(m => m.role === 'member').length;
    if (currentMemberCount >= fullTeam.maxMembers) {
      return res.status(400).json({
        message: `Limite de membres atteinte (${fullTeam.maxMembers} membres maximum)`,
        code: 'MAX_MEMBERS_REACHED',
      });
    }

    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Email invalide' });
    }
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already a team member
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const alreadyMember = fullTeam.members.some(
        m => String(m.user) === String(existingUser._id)
      );
      if (alreadyMember) {
        return res.status(400).json({ message: 'Cet utilisateur est déjà membre de l\'équipe' });
      }
    }

    // Revoke any existing unused invite for this email+team
    await TeamInvite.deleteMany({ team: fullTeam._id, email: normalizedEmail, used: false });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000);

    await TeamInvite.create({
      team: fullTeam._id,
      email: normalizedEmail,
      token,
      invitedBy: req.user._id,
      expiresAt,
    });

    // Send invitation email
    try {
      await sendTeamInviteEmail({
        to: normalizedEmail,
        teamName: fullTeam.name,
        inviterName: req.user.companyName || req.user.firstName || req.user.email,
        token,
      });
    } catch (emailErr) {
      console.error('[teams/invite] email failed:', emailErr.message);
    }

    res.json({ message: 'Invitation envoyée', email: normalizedEmail });
  } catch (err) {
    console.error('[teams/invite]', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ── GET /api/teams/invite/:token ──────────────────────────────────────────────
// Preview invite (public — used by JoinTeamPage before auth)
router.get('/invite/:token', async (req, res) => {
  try {
    const { token } = req.params;
    if (!/^[0-9a-f]{64}$/.test(token)) {
      return res.status(400).json({ valid: false, reason: 'invalid_token' });
    }

    const invite = await TeamInvite.findOne({ token })
      .populate('team', 'name subscription')
      .populate('invitedBy', 'companyName firstName email');

    if (!invite) return res.json({ valid: false, reason: 'not_found' });
    if (invite.used) return res.json({ valid: false, reason: 'already_used' });
    if (invite.expiresAt < new Date()) return res.json({ valid: false, reason: 'expired' });

    res.json({
      valid: true,
      email: invite.email,
      teamName: invite.team?.name,
      inviterName: invite.invitedBy?.companyName || invite.invitedBy?.firstName || invite.invitedBy?.email,
    });
  } catch (err) {
    console.error('[teams/invite/preview]', err);
    res.status(500).json({ valid: false, reason: 'server_error' });
  }
});

// ── POST /api/teams/join/:token ───────────────────────────────────────────────
// Accept invitation (must be authenticated)
router.post('/join/:token', authenticateClient, async (req, res) => {
  try {
    const { token } = req.params;
    if (!/^[0-9a-f]{64}$/.test(token)) {
      return res.status(400).json({ message: 'Token invalide' });
    }

    const invite = await TeamInvite.findOne({ token }).populate('team');

    if (!invite) return res.status(404).json({ message: 'Invitation introuvable' });
    if (invite.used) return res.status(400).json({ message: 'Invitation déjà utilisée' });
    if (invite.expiresAt < new Date()) return res.status(400).json({ message: 'Invitation expirée' });

    // Verify email matches
    if (invite.email !== req.user.email.toLowerCase()) {
      return res.status(403).json({ message: 'Cette invitation ne vous est pas destinée' });
    }

    const team = invite.team;

    // Check not already a member
    const alreadyMember = team.members.some(m => String(m.user) === String(req.user._id));
    if (alreadyMember) {
      return res.status(400).json({ message: 'Vous êtes déjà membre de cette équipe' });
    }

    // maxMembers counts members only (owner excluded)
    const currentMemberCount = team.members.filter(m => m.role === 'member').length;
    if (currentMemberCount >= team.maxMembers) {
      return res.status(400).json({ message: 'L\'équipe a atteint sa limite de membres' });
    }

    // Add member to team
    team.members.push({ user: req.user._id, role: 'member', joinedAt: new Date(), invitedBy: invite.invitedBy });
    await team.save();

    // Link user to this team (replace their personal team)
    await User.findByIdAndUpdate(req.user._id, { team: team._id });

    // Mark invite as used
    invite.used = true;
    await invite.save();

    res.json({ message: 'Vous avez rejoint l\'équipe avec succès', teamName: team.name });
  } catch (err) {
    console.error('[teams/join]', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ── DELETE /api/teams/members/:userId ─────────────────────────────────────────
// Remove a member (owner only)
router.delete('/members/:userId', authenticateClient, async (req, res) => {
  try {
    const team = await Team.findById(req.user.team?._id || req.user.team);
    if (!team) return res.status(404).json({ message: 'Équipe introuvable' });
    if (!requireTeamOwner(team, req, res)) return;

    const { userId } = req.params;

    if (String(userId) === String(team.owner)) {
      return res.status(400).json({ message: 'Impossible de retirer le propriétaire de l\'équipe' });
    }

    const beforeCount = team.members.length;
    team.members = team.members.filter(m => String(m.user) !== String(userId));

    if (team.members.length === beforeCount) {
      return res.status(404).json({ message: 'Membre introuvable dans l\'équipe' });
    }

    await team.save();

    // Restore member to their own personal team or clear team reference
    const removedUser = await User.findById(userId);
    if (removedUser) {
      // Create a new personal team for the removed user
      const personalTeam = await Team.create({
        name: removedUser.companyName || removedUser.email,
        owner: removedUser._id,
        members: [{ user: removedUser._id, role: 'owner', joinedAt: new Date() }],
        subscription: { plan: 'free', status: 'inactive' },
        maxMembers: 1,
        createdAt: new Date(),
      });
      await User.findByIdAndUpdate(removedUser._id, { team: personalTeam._id });
    }

    res.json({ message: 'Membre retiré de l\'équipe' });
  } catch (err) {
    console.error('[teams/members/delete]', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ── GET /api/teams/diagnostics ────────────────────────────────────────────────
// Team shared diagnostics — returns team owner's assessments
// Accessible to both owner and members with active team premium subscription
router.get('/diagnostics', authenticateClient, async (req, res) => {
  try {
    const team = await Team.findById(req.user.team?._id || req.user.team);
    if (!team) return res.status(404).json({ message: 'Équipe introuvable' });

    // Verify caller is actually in this team
    const isMember = team.members.some(m => String(m.user) === String(req.user._id));
    if (!isMember) return res.status(403).json({ message: 'Accès refusé' });

    if (!teamHasPremiumMulti(team)) {
      return res.status(403).json({ message: 'Abonnement Premium requis', code: 'PREMIUM_REQUIRED' });
    }

    // Always return the OWNER's assessments (only owner creates diagnostics)
    const assessments = await Assessment.find({ user: team.owner })
      .select('companyName sector companySize completedAt overallScore overallLevel pillarScores createdAt')
      .sort({ completedAt: -1 })
      .limit(20)
      .lean();

    res.json({ assessments, teamName: team.name });
  } catch (err) {
    console.error('[teams/diagnostics]', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
