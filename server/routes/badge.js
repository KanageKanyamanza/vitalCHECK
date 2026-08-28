const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const Assessment = require("../models/Assessment");
const User = require("../models/User");
const { authenticateClient } = require("./clientAuth");
const { checkSubscription } = require("../middleware/checkSubscription");

const PAID_PLANS = ["standard", "premium", "diagnostic"];
const BADGE_VALIDITY_MONTHS = 12;

// ── Helpers ──────────────────────────────────────────────────────────────────

function assessmentAge(completedAt) {
  if (!completedAt) return Infinity;
  const msPerMonth = 1000 * 60 * 60 * 24 * 30.44;
  return (Date.now() - new Date(completedAt).getTime()) / msPerMonth;
}

function badgeStatus(assessment, user) {
  if (!assessment.badge?.active || assessment.badge?.revokedAt) return "revoked";
  const sub = user?.subscription;
  const subActive =
    sub?.status === "active" &&
    PAID_PLANS.includes(sub?.plan) &&
    (!sub?.endDate || new Date(sub.endDate) > new Date());
  if (!subActive) return "expired";
  if (assessmentAge(assessment.completedAt) > BADGE_VALIDITY_MONTHS) return "outdated";
  return "valid";
}

// ── POST /api/badge/activate ──────────────────────────────────────────────────
// Activate a badge for one of the user's completed assessments.
// Protected: authenticated premium subscriber.
router.post(
  "/activate",
  authenticateClient,
  checkSubscription("paid"),
  async (req, res) => {
    try {
      const { assessmentId, showScore = false } = req.body;
      if (!assessmentId) {
        return res.status(400).json({ message: "assessmentId requis" });
      }

      const assessment = await Assessment.findOne({
        _id: assessmentId,
        user: req.user._id,
        status: "completed",
      });

      if (!assessment) {
        return res.status(404).json({ message: "Diagnostic introuvable ou non complété" });
      }

      // Generate token only if not already set
      const token =
        assessment.verificationToken || crypto.randomBytes(32).toString("hex");

      assessment.verificationToken = token;
      assessment.badge = {
        active: true,
        activatedAt: assessment.badge?.activatedAt || new Date(),
        showScore: !!showScore,
        revokedAt: null,
      };

      await assessment.save();

      res.json({
        success: true,
        verificationToken: token,
        verifyUrl: `/verify/${token}`,
        badge: assessment.badge,
      });
    } catch (err) {
      console.error("[badge/activate]", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// ── PATCH /api/badge/:assessmentId/settings ───────────────────────────────────
// Update badge settings (showScore toggle).
router.patch(
  "/:assessmentId/settings",
  authenticateClient,
  checkSubscription("paid"),
  async (req, res) => {
    try {
      const { showScore } = req.body;
      const assessment = await Assessment.findOne({
        _id: req.params.assessmentId,
        user: req.user._id,
        "badge.active": true,
      });

      if (!assessment) {
        return res.status(404).json({ message: "Badge introuvable" });
      }

      assessment.badge.showScore = !!showScore;
      await assessment.save();

      res.json({ success: true, badge: assessment.badge });
    } catch (err) {
      console.error("[badge/settings]", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// ── DELETE /api/badge/:assessmentId/revoke ────────────────────────────────────
// Revoke a badge — the verify page will show "invalid" but no data leaks.
router.delete(
  "/:assessmentId/revoke",
  authenticateClient,
  async (req, res) => {
    try {
      const assessment = await Assessment.findOne({
        _id: req.params.assessmentId,
        user: req.user._id,
      });

      if (!assessment) {
        return res.status(404).json({ message: "Diagnostic introuvable" });
      }

      assessment.badge.active = false;
      assessment.badge.revokedAt = new Date();
      await assessment.save();

      res.json({ success: true });
    } catch (err) {
      console.error("[badge/revoke]", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// ── GET /api/badge/list ───────────────────────────────────────────────────────
// List user's assessments with badge info (to display in the badge management page).
router.get("/list", authenticateClient, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const assessments = await Assessment.find({
      user: req.user._id,
      status: "completed",
    })
      .select(
        "companyName completedAt overallScore overallLevel verificationToken badge version sector"
      )
      .sort({ completedAt: -1 });

    const items = assessments.map((a) => ({
      id: a._id,
      companyName: a.companyName || user.companyName,
      completedAt: a.completedAt,
      overallScore: a.overallScore,
      overallLevel: a.overallLevel,
      sector: a.sector,
      version: a.version,
      verificationToken: a.verificationToken,
      badge: a.badge,
      badgeStatus: badgeStatus(a, user),
      verifyUrl: a.verificationToken ? `/verify/${a.verificationToken}` : null,
    }));

    res.json({ success: true, assessments: items });
  } catch (err) {
    console.error("[badge/list]", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
