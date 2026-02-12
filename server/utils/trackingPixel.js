/**
 * Pixel de tracking GIF transparent (1x1)
 * Encodé en base64 pour être servi directement
 */

// GIF transparent 1x1 pixel (base64)
const TRANSPARENT_GIF_BASE64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * Obtenir le buffer du pixel GIF transparent
 */
function getTrackingPixel() {
  return Buffer.from(TRANSPARENT_GIF_BASE64, 'base64');
}

/**
 * Obtenir le pixel comme réponse HTTP
 */
function getTrackingPixelResponse() {
  const pixel = getTrackingPixel();
  return {
    buffer: pixel,
    contentType: 'image/gif',
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Content-Length': pixel.length.toString()
    }
  };
}

module.exports = {
  getTrackingPixel,
  getTrackingPixelResponse,
  TRANSPARENT_GIF_BASE64
};
