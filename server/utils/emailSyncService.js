const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const Message = require('../models/Message');
const Contact = require('../models/Contact');
const MailingContact = require('../models/MailingContact');
const User = require('../models/User');

/**
 * Service pour synchroniser les réponses e-mails entrantes via IMAP
 */
class EmailSyncService {
  constructor() {
    // Les variables d'environnement sont résolues au moment de l'exécution (sync)
  }

  getInboxConfig() {
    return {
      host: process.env.IMAP_HOST || 'imap.ionos.fr',
      port: Number(process.env.IMAP_PORT) || 993,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      logger: false
    };
  }

  async sync() {
    console.log('🔄 [IMAP SYNC] Démarrage de la synchronisation...');
    const config = this.getInboxConfig();
    
    if (!config.auth.user || !config.auth.pass) {
      console.error('❌ [IMAP SYNC] Configuration manquante (user/pass)');
      return { success: false, error: 'Configuration manquante' };
    }

    const client = new ImapFlow(config);

    try {
      await client.connect();

      // Sélectionner la boîte de réception
      let lock = await client.getMailboxLock('INBOX');
      try {
        // Rechercher les messages non lus (ou tous les récents)
        // On pourrait aussi utiliser SINCE <date> pour éviter de tout reparcourir
        const lastSyncDate = new Date();
        lastSyncDate.setDate(lastSyncDate.getDate() - 7); // 7 derniers jours par défaut

        for await (let msg of client.fetch({ seen: false }, { source: true, envelope: true })) {
          try {
            const parsed = await simpleParser(msg.source);
            const fromEmail = parsed.from.value[0].address.toLowerCase();
            const toEmail = parsed.to.value[0].address.toLowerCase();
            const messageId = parsed.messageId;

            // Vérifier si le message a déjà été importé
            const existingMessage = await Message.findOne({ messageId });
            if (existingMessage) continue;

            console.log(`📥 [IMAP SYNC] Nouveau message détecté de ${fromEmail}`);

            // Trouver ou créer le contact associé
            const contactData = await this.findAssociateContact(fromEmail, parsed.from.value[0].name);

            // Enregistrer le message
            const newMessage = new Message({
              contactId: contactData.id,
              contactModel: contactData.model,
              direction: 'inbound',
              from: fromEmail,
              to: toEmail,
              subject: parsed.subject,
              body: parsed.text || parsed.textAsHtml || '',
              htmlBody: parsed.html || '',
              date: parsed.date || new Date(),
              messageId: messageId,
              threadId: parsed.references ? (Array.isArray(parsed.references) ? parsed.references[0] : parsed.references) : messageId
            });

            await newMessage.save();
            
            // On peut marquer comme lu ou laisser tel quel sur le serveur
            // await client.messageFlagsAdd(msg.uid, ['\\Seen']);
            
          } catch (parseError) {
            console.error(`❌ [IMAP SYNC] Erreur lors du parsing d'un message:`, parseError);
          }
        }
      } finally {
        lock.release();
      }

      await client.logout();
      console.log('✅ [IMAP SYNC] Synchronisation terminée avec succès');
      return { success: true };
    } catch (error) {
      console.error('❌ [IMAP SYNC] Erreur globale lors de la synchronisation:', error);
      throw error;
    }
  }

  /**
   * Cherche un contact, abonné ou utilisateur par email.
   * Si aucun n'est trouvé, crée un nouveau 'Contact'.
   */
  async findAssociateContact(email, rawName) {
    // 1. Chercher dans Contact (le plus probable pour le CRM)
    const contact = await Contact.findOne({ email });
    if (contact) return { id: contact._id, model: 'Contact' };

    // 2. Chercher dans User
    const user = await User.findOne({ email });
    if (user) return { id: user._id, model: 'User' };

    // 3. Chercher dans MailingContact
    const mailing = await MailingContact.findOne({ email });
    if (mailing) return { id: mailing._id, model: 'MailingContact' };

    // 4. Créer un nouveau contact si inconnu
    console.log(`👤 [IMAP SYNC] Création d'un nouveau contact pour ${email}`);
    const nameParts = (rawName || '').split(' ');
    const newContact = new Contact({
      name: rawName || email.split('@')[0],
      email: email,
      subject: 'Contact initial via Email',
      message: 'Contact créé automatiquement lors de la réception d\'un e-mail direct.',
      inquiryType: 'general',
      status: 'new'
    });
    const saved = await newContact.save();
    return { id: saved._id, model: 'Contact' };
  }
}

module.exports = new EmailSyncService();
