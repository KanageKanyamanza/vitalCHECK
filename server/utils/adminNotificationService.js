const Notification = require('../models/Notification');
const Admin = require('../models/Admin');
const { sendAdminNotificationEmail } = require('./emailService');

const REPORT_DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

async function notifyAdminRegistration(user) {
  try {
    await new Notification({
      type: 'user_registered',
      title: 'Nouvelle inscription',
      message: `${user.companyName} (${user.email}) vient de s'inscrire`,
      user: {
        id: user._id,
        name: user.companyName,
        email: user.email,
        sector: user.sector,
        companySize: user.companySize,
      },
    }).save();

    _emailAdmins('user_registered', { user }).catch(err =>
      console.error('[adminNotif] email registration:', err.message)
    );
  } catch (err) {
    console.error('[adminNotif] registration notification failed:', err.message);
  }
}

async function notifyAdminReportPrinted(user, assessment) {
  try {
    const cutoff = new Date(Date.now() - REPORT_DEDUP_WINDOW_MS);
    const existing = await Notification.findOne({
      type: 'report_printed',
      'assessment.id': assessment._id,
      createdAt: { $gte: cutoff },
    });
    if (existing) return;

    await new Notification({
      type: 'report_printed',
      title: 'Rapport généré',
      message: `Rapport de ${user.companyName} — Score : ${assessment.overallScore}/100`,
      user: {
        id: user._id,
        name: user.companyName,
        email: user.email,
        sector: user.sector,
        companySize: user.companySize,
      },
      assessment: {
        id: assessment._id,
        score: assessment.overallScore,
        status: assessment.overallLevel,
        completedAt: assessment.completedAt,
      },
    }).save();

    _emailAdmins('report_printed', { user, assessment }).catch(err =>
      console.error('[adminNotif] email report_printed:', err.message)
    );
  } catch (err) {
    console.error('[adminNotif] report notification failed:', err.message);
  }
}

async function _emailAdmins(type, data) {
  if (process.env.ADMIN_EMAIL_NOTIFICATIONS === 'false') return;
  const admins = await Admin.find({ isActive: true }).select('email name').lean();
  if (!admins.length) return;
  await sendAdminNotificationEmail(admins, type, data);
}

module.exports = { notifyAdminRegistration, notifyAdminReportPrinted };
