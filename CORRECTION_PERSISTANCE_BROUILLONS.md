# Correction de la Persistance des Brouillons d'Évaluations

## Date: 10 Octobre 2025

## 🔍 Problème Identifié

**Symptôme :**
- Les évaluations en brouillon persistent même après qu'une évaluation complète ait été générée
- Dans les logs : `🔍 [DASHBOARD] Assessments loaded: (3) [{…}, {…}, {…}]`
- L'utilisateur voit des brouillons inutiles dans son dashboard
- Exemple : 1 évaluation complétée + 2 brouillons persistants

**Cause Identifiée :**
- **Aucune logique de nettoyage** des brouillons après soumission d'évaluation
- Les brouillons restent en base de données même après génération du rapport
- Pas de suppression automatique des drafts inutiles

---

## ✅ Solution Appliquée

### **1. Nettoyage Automatique lors de la Soumission**

**Fichier :** `server/routes/assessments.js`
**Route :** `POST /submit`

```javascript
// Nettoyer les brouillons d'évaluations pour cet utilisateur
try {
  const deletedDrafts = await Assessment.deleteMany({
    user: userId,
    status: 'draft',
    _id: { $ne: assessment._id } // Ne pas supprimer l'évaluation qui vient d'être complétée
  });
  
  if (deletedDrafts.deletedCount > 0) {
    console.log(`🧹 [CLEANUP] ${deletedDrafts.deletedCount} brouillon(s) supprimé(s) pour ${user.companyName}`);
  }
} catch (cleanupError) {
  console.error('❌ Erreur lors du nettoyage des brouillons:', cleanupError);
  // Ne pas faire échouer la soumission pour une erreur de nettoyage
}
```

### **2. Nettoyage lors de la Génération de Rapport**

**Fichier :** `server/routes/reports.js`
**Route :** `POST /generate/:assessmentId`

```javascript
// Nettoyer les brouillons d'évaluations pour cet utilisateur après génération du rapport
try {
  const deletedDrafts = await Assessment.deleteMany({
    user: assessment.user._id,
    status: 'draft',
    _id: { $ne: assessment._id } // Ne pas supprimer l'évaluation qui vient d'avoir son rapport généré
  });
  
  if (deletedDrafts.deletedCount > 0) {
    console.log(`🧹 [REPORT-CLEANUP] ${deletedDrafts.deletedCount} brouillon(s) supprimé(s) pour ${assessment.user.companyName}`);
  }
} catch (cleanupError) {
  console.error('❌ Erreur lors du nettoyage des brouillons après génération de rapport:', cleanupError);
  // Ne pas faire échouer la génération de rapport pour une erreur de nettoyage
}
```

### **3. Script de Nettoyage Manuel**

**Fichier :** `server/scripts/cleanup-draft-assessments.js`

Script pour nettoyer les brouillons existants dans la base de données :

```javascript
// Trouver tous les utilisateurs avec des évaluations complétées
const usersWithCompletedAssessments = await User.find({
  assessments: { $exists: true, $not: { $size: 0 } }
}).populate('assessments');

// Supprimer les brouillons pour chaque utilisateur ayant des évaluations complétées
for (const user of usersWithCompletedAssessments) {
  const completedAssessments = user.assessments.filter(assessment => assessment.status === 'completed');
  const draftAssessments = user.assessments.filter(assessment => assessment.status === 'draft');

  if (completedAssessments.length > 0 && draftAssessments.length > 0) {
    // Supprimer tous les brouillons
    for (const draft of draftAssessments) {
      await Assessment.deleteOne({ _id: draft._id });
    }
    
    // Mettre à jour le tableau assessments de l'utilisateur
    user.assessments = completedAssessments.map(assessment => assessment._id);
    await user.save();
  }
}
```

---

## 🎯 Logique de Nettoyage

### **Critères de Suppression**
- ✅ **Utilisateur** : Même utilisateur que l'évaluation complétée
- ✅ **Statut** : `status: 'draft'`
- ✅ **Exclusion** : `_id: { $ne: assessment._id }` (ne pas supprimer l'évaluation actuelle)
- ✅ **Condition** : Seulement si l'utilisateur a une évaluation complétée

### **Moment de Nettoyage**
1. **Après soumission** d'évaluation (`POST /submit`)
2. **Après génération** de rapport (`POST /generate/:assessmentId`)
3. **Manuellement** via script de nettoyage

### **Sécurité**
- ✅ **Gestion d'erreur** : Le nettoyage ne fait pas échouer l'opération principale
- ✅ **Logging** : Messages de console pour traçabilité
- ✅ **Protection** : Ne supprime jamais l'évaluation actuelle

---

## 📊 Résultat Attendu

### **Avant (Problématique)**
```
👤 Utilisateur: Banks and Cohen Co
   ✅ Évaluations complétées: 1
   📝 Brouillons persistants: 2  ← PROBLÈME
   Total: 3 évaluations
```

### **Maintenant (Corrigé)**
```
👤 Utilisateur: Banks and Cohen Co
   ✅ Évaluations complétées: 1
   📝 Brouillons: 0  ← NETTOYÉ
   Total: 1 évaluation
```

---

## 🔧 Utilisation du Script de Nettoyage

### **Exécution du Script**
```bash
cd server
node scripts/cleanup-draft-assessments.js
```

### **Sortie Attendue**
```
Connexion à MongoDB réussie.

👤 Utilisateur: Banks and Cohen Co (haurlyroll@gmail.com)
   ✅ Évaluations complétées: 1
   📝 Brouillons à supprimer: 2
   🗑️  Brouillon supprimé: 68e8ed623bb555fc6f401020
   🗑️  Brouillon supprimé: 68e8ed623bb555fc6f401022
   ✅ Utilisateur mis à jour: 1 évaluation(s) conservée(s)

🧹 Nettoyage terminé:
   👥 Utilisateurs traités: 1
   🗑️  Brouillons supprimés: 2

📊 Statistiques finales:
   📝 Brouillons restants: 0
   ✅ Évaluations complétées: 1
```

---

## 📁 Fichiers Modifiés

### **`server/routes/assessments.js`**
- ✅ Ajout du nettoyage des brouillons après soumission
- ✅ Logging des suppressions
- ✅ Gestion d'erreur sécurisée

### **`server/routes/reports.js`**
- ✅ Ajout du nettoyage des brouillons après génération de rapport
- ✅ Logging des suppressions
- ✅ Gestion d'erreur sécurisée

### **`server/scripts/cleanup-draft-assessments.js`**
- ✅ Script de nettoyage manuel des brouillons existants
- ✅ Statistiques détaillées
- ✅ Mise à jour des références utilisateur

---

## ✅ Résumé

**Problème résolu :** Persistance des brouillons d'évaluations après soumission
**Cause :** Absence de logique de nettoyage automatique
**Solution :** Nettoyage automatique lors de la soumission et génération de rapport
**Bonus :** Script de nettoyage manuel pour les données existantes

Les utilisateurs ne verront plus de brouillons inutiles dans leur dashboard ! 🎉
