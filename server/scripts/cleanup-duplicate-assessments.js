#!/usr/bin/env node

/**
 * Script pour nettoyer les évaluations en double
 * 
 * Ce script identifie et supprime les évaluations en double créées
 * par le même utilisateur le même jour.
 */

const mongoose = require('mongoose');
const Assessment = require('../models/Assessment');
const User = require('../models/User');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitalCHECK';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
}

async function cleanupDuplicateAssessments() {
  try {
    console.log('🔍 Recherche des évaluations en double...');
    
    // Trouver toutes les évaluations complétées
    const assessments = await Assessment.find({ 
      status: 'completed' 
    }).populate('user', 'email companyName').sort({ user: 1, completedAt: 1 });
    
    console.log(`📊 Total d'évaluations trouvées: ${assessments.length}`);
    
    // Grouper par utilisateur et date
    const groupedByUserAndDate = {};
    
    assessments.forEach(assessment => {
      const userId = assessment.user._id.toString();
      const date = assessment.completedAt.toISOString().split('T')[0]; // YYYY-MM-DD
      const key = `${userId}_${date}`;
      
      if (!groupedByUserAndDate[key]) {
        groupedByUserAndDate[key] = [];
      }
      groupedByUserAndDate[key].push(assessment);
    });
    
    // Identifier les doublons
    const duplicates = [];
    Object.keys(groupedByUserAndDate).forEach(key => {
      const assessments = groupedByUserAndDate[key];
      if (assessments.length > 1) {
        // Garder la première (plus ancienne) et marquer les autres comme doublons
        const [first, ...duplicates] = assessments;
        duplicates.forEach(dup => {
          duplicates.push({
            assessment: dup,
            reason: `Double de ${first._id} (${first.user.email} - ${key.split('_')[1]})`
          });
        });
      }
    });
    
    console.log(`🔄 Doublons trouvés: ${duplicates.length}`);
    
    if (duplicates.length === 0) {
      console.log('✅ Aucun doublon trouvé');
      return;
    }
    
    // Afficher les détails des doublons
    console.log('\n📋 Détails des doublons:');
    duplicates.forEach((dup, index) => {
      const assessment = dup.assessment;
      console.log(`${index + 1}. ID: ${assessment._id}`);
      console.log(`   Utilisateur: ${assessment.user.email} (${assessment.user.companyName})`);
      console.log(`   Date: ${assessment.completedAt.toISOString()}`);
      console.log(`   Score: ${assessment.overallScore || 'N/A'}`);
      console.log(`   Raison: ${dup.reason}`);
      console.log('');
    });
    
    // Demander confirmation avant suppression
    if (process.argv.includes('--confirm')) {
      console.log('🗑️ Suppression des doublons...');
      
      let deletedCount = 0;
      for (const dup of duplicates) {
        try {
          await Assessment.findByIdAndDelete(dup.assessment._id);
          deletedCount++;
          console.log(`✅ Supprimé: ${dup.assessment._id}`);
        } catch (error) {
          console.error(`❌ Erreur suppression ${dup.assessment._id}:`, error.message);
        }
      }
      
      console.log(`\n🎉 Nettoyage terminé: ${deletedCount}/${duplicates.length} évaluations supprimées`);
      
      // Mettre à jour les références dans les utilisateurs
      console.log('🔄 Mise à jour des références utilisateur...');
      const userIds = [...new Set(duplicates.map(dup => dup.assessment.user._id))];
      
      for (const userId of userIds) {
        const user = await User.findById(userId);
        if (user) {
          const deletedIds = duplicates
            .filter(dup => dup.assessment.user._id.toString() === userId.toString())
            .map(dup => dup.assessment._id);
          
          user.assessments = user.assessments.filter(
            assessmentId => !deletedIds.some(id => id.toString() === assessmentId.toString())
          );
          
          await user.save();
          console.log(`✅ Références mises à jour pour: ${user.email}`);
        }
      }
      
    } else {
      console.log('\n⚠️  Mode simulation - aucune suppression effectuée');
      console.log('Pour confirmer la suppression, ajoutez --confirm à la commande');
      console.log('Exemple: node cleanup-duplicate-assessments.js --confirm');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

async function main() {
  await connectDB();
  await cleanupDuplicateAssessments();
  await mongoose.disconnect();
  console.log('✅ Script terminé');
}

// Exécuter le script
main().catch(console.error);
