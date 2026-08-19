const User = require('../models/User');

const PAID_PLANS = ['standard', 'premium', 'diagnostic'];

/**
 * Middleware factory that verifies an active subscription before granting access.
 *
 * Usage:
 *   router.get('/premium-route', authenticateClient, checkSubscription(), handler)
 *   router.get('/premium-only', authenticateClient, checkSubscription('premium'), handler)
 *
 * requiredPlan:
 *   'paid'     — any paying plan (standard / premium / diagnostic)
 *   'premium'  — premium or diagnostic only
 *   'standard' — standard or above
 */
const checkSubscription = (requiredPlan = 'paid') => {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: 'Authentification requise',
        code: 'AUTH_REQUIRED',
      });
    }

    const sub = user.subscription;

    if (!sub || sub.status !== 'active') {
      return res.status(403).json({
        message: 'Abonnement actif requis',
        code: 'SUBSCRIPTION_INACTIVE',
      });
    }

    // endDate null = perpetual access (Diagnostic one-time plan)
    if (sub.endDate && sub.endDate < new Date()) {
      // Expire in the background — don't block the error response
      User.findByIdAndUpdate(user._id, {
        'subscription.status': 'expired',
        isPremium: false,
      }).exec().catch(err =>
        console.error('[checkSubscription] expiration update failed:', err.message)
      );

      return res.status(403).json({
        message: 'Abonnement expiré — veuillez renouveler votre plan',
        code: 'SUBSCRIPTION_EXPIRED',
      });
    }

    const plan = sub.plan;

    if (requiredPlan === 'paid') {
      if (!PAID_PLANS.includes(plan)) {
        return res.status(403).json({
          message: 'Plan payant requis',
          code: 'PLAN_UPGRADE_REQUIRED',
        });
      }
    } else if (requiredPlan === 'premium') {
      if (!['premium', 'diagnostic'].includes(plan)) {
        return res.status(403).json({
          message: 'Plan Premium requis',
          code: 'PLAN_UPGRADE_REQUIRED',
        });
      }
    } else if (plan !== requiredPlan) {
      return res.status(403).json({
        message: `Plan ${requiredPlan} requis`,
        code: 'PLAN_UPGRADE_REQUIRED',
      });
    }

    next();
  };
};

module.exports = { checkSubscription };
