const mongoose = require('mongoose');
const BlogVisit = require('./models/BlogVisit');
require('dotenv').config();

async function testTracking() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ubb-health-check');
    console.log('✅ Connecté à MongoDB');

    // Créer une visite de test
    const testVisit = new BlogVisit({
      blog: new mongoose.Types.ObjectId('68d292cb66cde90be0a33243'),
      user: null,
      sessionId: 'test-session-123',
      ipAddress: '127.0.0.1',
      userAgent: 'Test User Agent',
      device: {
        type: 'desktop',
        brand: 'Test',
        model: 'Test Model',
        os: 'Windows',
        osVersion: '10',
        browser: 'Chrome',
        browserVersion: '120'
      },
      referrer: 'https://google.com',
      referrerDomain: 'google.com',
      pageTitle: 'Test Blog',
      pageUrl: 'http://localhost:5000/api/blogs/test'
    });

    const savedVisit = await testVisit.save();
    console.log('✅ Visite de test sauvegardée:', savedVisit._id);

    // Vérifier les statistiques
    const totalVisits = await BlogVisit.countDocuments();
    console.log('📊 Total des visites:', totalVisits);

    // Vérifier les visites pour ce blog
    const blogVisits = await BlogVisit.find({ blog: '68d292cb66cde90be0a33243' });
    console.log('📊 Visites pour ce blog:', blogVisits.length);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testTracking();
