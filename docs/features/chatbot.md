# 🤖 Assistant Virtuel (Chatbot)

vitalCHECK intègre un chatbot basé sur des règles pour aider les utilisateurs à naviguer et répondre à leurs questions fréquentes.

## 🧠 Fonctionnalités Clés

- **Support Multilingue** : Réponses adaptées en français et en anglais.
- **Détection d'Intentions** : Identification des sujets clés (évaluation, prix, contact) via des mots-clés.
- **Recherche FAQ** : Recherche dans une base de questions/réponses statique et dynamique.
- **Apprentissage & Suivi** : Enregistrement des questions non comprises pour permettre aux admins d'enrichir la base.
- **Liens Rapides** : Proposition de raccourcis de navigation dans les réponses.

---

## ⚙️ Implémentation Backend

Le chatbot utilise une approche par étapes pour trouver la meilleure réponse possible.

### Fichiers Principaux

- `server/routes/chatbot.js` : Route principale et logique de décision.
- `server/data/chatbot-translations.js` : Contenu statique des FAQs et intentions par langue.
- `server/models/ChatbotInteraction.js` : Historique des conversations.
- `server/models/ChatbotResponse.js` : Réponses personnalisées ajoutées par les admins.

### Routes API (`/api/chat`)

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/chatbot` | Reçoit le message de l'utilisateur et retourne la réponse du bot. |

### Logique de Décision (Priorités)

Quand un message arrive, le serveur cherche dans cet ordre :

1. **Mots de salutation** : Si le message est un simple "bonjour", il renvoie le message d'accueil standard.
2. **Réponses Personnalisées** (`ChatbotResponse`) : Recherche dans la base de données des réponses ajoutées manuellement par les admins (recherche par mots-clés ou texte).
3. **FAQ Statique** : Recherche par mots-clés dans le fichier `chatbot-translations.js`.
4. **Intention** : Analyse si le message correspond à une intention globale (ex: vouloir faire le test).
5. **Fallback** : Si rien n'est trouvé, le bot répond qu'il n'a pas compris et enregistre la question avec le statut `pending` pour revue ultérieure.

---

## 🎨 Implémentation Frontend

Le frontend affiche une bulle de chat flottante accessible sur toutes les pages.

### Composants

- `client/src/components/chat/` : Contient l'interface du chat, la gestion des messages et les boutons de suggestion.

### Flux d'Interaction

1. L'utilisateur ouvre la bulle et tape un message.
2. Le frontend envoie le message avec la langue actuelle de l'interface et l'ID de l'utilisateur s'il est connecté.
3. Le bot répond et peut afficher des "Quick Links" (boutons cliquables pour naviguer) ou des suggestions de questions suivantes.
