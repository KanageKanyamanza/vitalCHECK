// Image jointe à un email envoyé depuis le CRM (formulaire /admin/emails).

const escapeHtml = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Accepte uniquement une image hébergée sur notre Cloudinary (envoyée par l'upload admin), en https.
 * Renvoie null si aucune image, undefined si l'adresse est refusée, sinon l'adresse normalisée.
 */
const parseEmailImageUrl = (value, cloudName = process.env.CLOUDINARY_CLOUD_NAME) => {
  if (value == null || value === '') return null;
  try {
    const url = new URL(String(value));
    if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com') return undefined;
    if (cloudName && !url.pathname.startsWith(`/${cloudName}/`)) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
};

/** Bloc image placé sous le message ; largeur fixe de 600 px pour Outlook, fluide ailleurs. */
const emailImageBlock = (imageUrl, alt) => `
  <div style="margin: 24px 0 0 0; text-align: center;">
    <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(alt)}" width="600" style="display: block; width: 100%; max-width: 600px; height: auto; border: 0; border-radius: 8px; margin: 0 auto;" />
  </div>`;

module.exports = { parseEmailImageUrl, emailImageBlock };
