// Recherche d'utilisateur par email — lancer avec : npm run test:user-email
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeEmailInput, legacyGmailForm, findUserByEmail } = require('../utils/userEmail');

// Faux modèle User : findOne({ email, ...filter }) sur une liste, avec .select() chaînable
const fakeUserModel = (users) => ({
  findOne(criteria) {
    const found = users.find((u) => Object.entries(criteria).every(([k, v]) => u[k] === v)) || null;
    const promise = Promise.resolve(found);
    promise.select = () => promise;
    return promise;
  },
});

test('adresse gardée telle que saisie, en minuscules', () => {
  assert.equal(normalizeEmailInput('  Prenom.Nom@Gmail.com '), 'prenom.nom@gmail.com');
});

test('ancienne forme Gmail : points et +étiquette retirés ; rien pour les autres domaines', () => {
  assert.equal(legacyGmailForm('prenom.nom@gmail.com'), 'prenomnom@gmail.com');
  assert.equal(legacyGmailForm('prenom.nom+test@googlemail.com'), 'prenomnom@gmail.com');
  assert.equal(legacyGmailForm('prenomnom@gmail.com'), null);
  assert.equal(legacyGmailForm('prenom.nom@ubb.sn'), null);
});

test('compte créé avant le correctif (sans points) retrouvé avec la vraie adresse', async () => {
  const User = fakeUserModel([{ email: 'prenomnom@gmail.com', hasAccount: true }]);
  const user = await findUserByEmail(User, 'Prenom.Nom@gmail.com', { select: '+password' });
  assert.equal(user.email, 'prenomnom@gmail.com');
});

test('adresse exacte prioritaire, filtre respecté, inconnu -> null', async () => {
  const User = fakeUserModel([
    { email: 'prenom.nom@gmail.com', hasAccount: true },
    { email: 'prenomnom@gmail.com', hasAccount: true },
    { email: 'autre@ubb.sn', hasAccount: false },
  ]);
  assert.equal((await findUserByEmail(User, 'prenom.nom@gmail.com')).email, 'prenom.nom@gmail.com');
  assert.equal(await findUserByEmail(User, 'autre@ubb.sn', { filter: { hasAccount: true } }), null);
  assert.equal(await findUserByEmail(User, 'personne@ubb.sn'), null);
});
