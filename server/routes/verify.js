const express = require("express");
const router = express.Router();
const Assessment = require("../models/Assessment");
const User = require("../models/User");

const PAID_PLANS = ["standard", "premium", "diagnostic"];
const BADGE_VALIDITY_MONTHS = 12;

function assessmentAge(completedAt) {
  if (!completedAt) return Infinity;
  const msPerMonth = 1000 * 60 * 60 * 24 * 30.44;
  return (Date.now() - new Date(completedAt).getTime()) / msPerMonth;
}

// ── GET /api/verify/public ───────────────────────────────────────────────────
// Public — returns up to 12 companies with an active, non-revoked badge.
// Only exposes: companyName, sector, completedAt, score (if showScore), token.
router.get("/public", async (req, res) => {
  try {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setMonth(cutoff.getMonth() - BADGE_VALIDITY_MONTHS);

    // Find assessments with an active badge completed within 12 months
    const assessments = await Assessment.find({
      "badge.active": true,
      "badge.revokedAt": null,
      completedAt: { $gte: cutoff },
      verificationToken: { $ne: null },
    })
      .select("companyName sector completedAt overallScore overallLevel badge verificationToken user")
      .sort({ completedAt: -1 })
      .limit(20)
      .lean();

    if (!assessments.length) return res.json({ companies: [] });

    // Verify subscriptions are still active for each
    const userIds = [...new Set(assessments.map((a) => String(a.user)).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } })
      .select("_id subscription")
      .lean();
    const userMap = Object.fromEntries(users.map((u) => [String(u._id), u]));

    const companies = assessments
      .filter((a) => {
        const u = userMap[String(a.user)];
        const sub = u?.subscription;
        return (
          sub?.status === "active" &&
          PAID_PLANS.includes(sub?.plan) &&
          (!sub?.endDate || new Date(sub.endDate) > now)
        );
      })
      .slice(0, 12)
      .map((a) => ({
        token: a.verificationToken,
        companyName: a.companyName || null,
        sector: a.sector || null,
        completedAt: a.completedAt || null,
        score: a.badge?.showScore
          ? { overall: a.overallScore, level: a.overallLevel }
          : null,
      }));

    res.json({ companies });
  } catch (err) {
    console.error("[verify/public]", err);
    res.status(500).json({ companies: [] });
  }
});

// ── GET /api/verify/:token ────────────────────────────────────────────────────
// Public — no authentication. Returns only the approved public data.
// NEVER returns: email, phone, answers, pillar detail, plan/price.
router.get("/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Basic sanity check — token must be 64 hex chars
    if (!/^[0-9a-f]{64}$/.test(token)) {
      return res.status(404).json({ found: false, reason: "invalid_token" });
    }

    const assessment = await Assessment.findOne({
      verificationToken: token,
    }).select(
      "companyName completedAt overallScore overallLevel badge verificationToken user sector"
    );

    if (!assessment) {
      return res.status(404).json({ found: false, reason: "not_found" });
    }

    // Fetch the user to check subscription status — never expose user data
    const user = await User.findById(assessment.user).select(
      "subscription companyName"
    );

    // Determine badge status
    const isRevoked = !assessment.badge?.active || !!assessment.badge?.revokedAt;
    const sub = user?.subscription;
    const subActive =
      !isRevoked &&
      sub?.status === "active" &&
      PAID_PLANS.includes(sub?.plan) &&
      (!sub?.endDate || new Date(sub.endDate) > new Date());
    const ageMonths = assessmentAge(assessment.completedAt);
    const isOutdated = subActive && ageMonths > BADGE_VALIDITY_MONTHS;

    let status;
    if (isRevoked) status = "revoked";
    else if (!subActive) status = "expired";
    else if (isOutdated) status = "outdated";
    else status = "valid";

    // Build the public payload — strictly limited
    const payload = {
      found: true,
      status,                                         // valid | outdated | expired | revoked
      companyName: assessment.companyName || user?.companyName || null,
      sector: assessment.sector || null,
      completedAt: assessment.completedAt || null,
      // Score revealed only if the company explicitly opted in AND badge is valid/outdated
      score:
        assessment.badge?.showScore && status !== "revoked" && status !== "expired"
          ? { overall: assessment.overallScore, level: assessment.overallLevel }
          : null,
    };

    res.json(payload);
  } catch (err) {
    console.error("[verify]", err);
    res.status(500).json({ found: false, reason: "server_error" });
  }
});

module.exports = router;
