// Image dans les emails du CRM — lancer avec : npm run test:email-image
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseEmailImageUrl, emailImageBlock } = require('../utils/emailImage');

const ours = 'https://res.cloudinary.com/vitalcheck/image/upload/v1/vitalCHECK-blog/promo.png';

test('aucune image : null', () => {
  assert.equal(parseEmailImageUrl(undefined, 'vitalcheck'), null);
  assert.equal(parseEmailImageUrl('', 'vitalcheck'), null);
});

test('image de notre Cloudinary en https : acceptée', () => {
  assert.equal(parseEmailImageUrl(ours, 'vitalcheck'), ours);
});

test('autre site, http, autre compte Cloudinary ou adresse invalide : refusés', () => {
  assert.equal(parseEmailImageUrl('https://exemple.com/image.png', 'vitalcheck'), undefined);
  assert.equal(parseEmailImageUrl(ours.replace('https:', 'http:'), 'vitalcheck'), undefined);
  assert.equal(parseEmailImageUrl('https://res.cloudinary.com/autrecompte/image/upload/x.png', 'vitalcheck'), undefined);
  assert.equal(parseEmailImageUrl('javascript:alert(1)', 'vitalcheck'), undefined);
  assert.equal(parseEmailImageUrl('pas une adresse', 'vitalcheck'), undefined);
});

test('bloc image : largeur 600 px, texte alternatif échappé', () => {
  const html = emailImageBlock(ours, 'Offre "spéciale" <test>');
  assert.ok(html.includes(`src="${ours}"`));
  assert.ok(html.includes('width="600"'));
  assert.ok(html.includes('alt="Offre &quot;spéciale&quot; &lt;test&gt;"'));
});
