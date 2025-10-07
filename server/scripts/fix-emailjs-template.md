# 🔧 Correction du template EmailJS

## 📧 Problèmes identifiés

1. **To** : Affiche `info@checkmyenterprise.com` au lieu de l'email du client
2. **From** : Affiche `haurlyroll@gmail.com` au lieu de `info@checkmyenterprise.com`
3. **Contenu** : S'affiche en HTML brut au lieu d'être rendu

## 🛠️ Configuration EmailJS requise

### **1. Service Email**
- **Service** : Gmail
- **Email** : `haurlyroll@gmail.com` (pour l'authentification)
- **Mot de passe** : Mot de passe d'application Gmail

### **2. Template EmailJS**

#### **Onglet "Content" :**
```
Subject: {{subject}}

Content: {{html_content}}
```

#### **Onglet "Settings" :**
- **To Email** : `{{to_email}}` (pas `info@checkmyenterprise.com`)
- **From Name** : `{{name}}`
- **From Email** : `{{email}}`
- **Reply To** : `{{email}}`

### **3. Variables utilisées**
- `{{to_email}}` - Email du destinataire (client)
- `{{subject}}` - Sujet de l'email
- `{{html_content}}` - Contenu HTML de l'email
- `{{name}}` - Nom de l'expéditeur
- `{{email}}` - Email de l'expéditeur

## ✅ Configuration correcte

### **Dans EmailJS :**
1. **To Email** : `{{to_email}}` (variable dynamique)
2. **From Name** : `{{name}}` → "VitalCheck Enterprise Health Check"
3. **From Email** : `{{email}}` → "info@checkmyenterprise.com"
4. **Subject** : `{{subject}}`
5. **Content** : `{{html_content}}`

### **Résultat attendu :**
```
De: VitalCheck Enterprise Health Check <info@checkmyenterprise.com>
À: client@example.com
Sujet: Relance - Évaluation VitalCheck Enterprise Health Check
Contenu: HTML rendu correctement
```

## 🚨 Points importants

1. **To Email** doit être `{{to_email}}` (variable), pas une adresse fixe
2. **From Email** doit être `{{email}}` (variable), pas `haurlyroll@gmail.com`
3. **Content** doit être `{{html_content}}` pour que le HTML soit rendu
4. Le service Gmail utilise `haurlyroll@gmail.com` pour l'authentification (caché)

## 🔧 Actions à faire

1. Modifier le template EmailJS avec les bonnes variables
2. Tester l'envoi d'email
3. Vérifier que le contenu s'affiche correctement
