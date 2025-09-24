import { blogApiService } from './api';

class TrackingService {
  constructor() {
    this.visitId = null;
    this.startTime = null;
    this.scrollDepth = 0;
    this.maxScrollDepth = 0;
    this.isTracking = false;
  }

  // Initialiser le tracking pour une visite
  initTracking(visitId) {
    console.log('🎯 [CLIENT TRACKING] Initialisation du tracking:', visitId);
    
    this.visitId = visitId;
    this.startTime = Date.now();
    this.scrollDepth = 0;
    this.maxScrollDepth = 0;
    this.isTracking = true;

    console.log('🎯 [CLIENT TRACKING] Tracking démarré:', {
      visitId: this.visitId,
      startTime: this.startTime
    });

    // Démarrer le tracking du scroll
    this.startScrollTracking();
    
    // Démarrer le tracking du temps
    this.startTimeTracking();

    // Tracker la fermeture de la page
    this.trackPageUnload();
  }

  // Tracker le scroll
  startScrollTracking() {
    let ticking = false;

    const updateScrollDepth = () => {
      if (!this.isTracking) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

      this.scrollDepth = Math.min(scrollPercent, 100);
      this.maxScrollDepth = Math.max(this.maxScrollDepth, this.scrollDepth);

      if (!ticking) {
        requestAnimationFrame(() => {
          this.sendTrackingUpdate();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateScrollDepth, { passive: true });
  }

  // Tracker le temps passé sur la page
  startTimeTracking() {
    // Mettre à jour le temps toutes les 30 secondes
    this.timeInterval = setInterval(() => {
      if (this.isTracking) {
        this.sendTrackingUpdate();
      }
    }, 30000);
  }

  // Envoyer les données de tracking au serveur
  async sendTrackingUpdate(action = 'update') {
    if (!this.visitId || !this.isTracking) {
      console.log('🎯 [CLIENT TRACKING] Pas de tracking actif:', {
        visitId: this.visitId,
        isTracking: this.isTracking
      });
      return;
    }

    try {
      const timeOnPage = Math.floor((Date.now() - this.startTime) / 1000);
      
      console.log('🎯 [CLIENT TRACKING] Envoi des données:', {
        visitId: this.visitId,
        timeOnPage,
        scrollDepth: this.maxScrollDepth,
        action
      });
      
      await blogApiService.trackVisit(this.visitId, {
        timeOnPage,
        scrollDepth: this.maxScrollDepth,
        action
      });
      
      console.log('✅ [CLIENT TRACKING] Données envoyées avec succès');
    } catch (error) {
      console.error('❌ [CLIENT TRACKING] Erreur lors de l\'envoi du tracking:', error);
    }
  }

  // Tracker la fermeture de la page
  trackPageUnload() {
    const handleUnload = () => {
      if (this.isTracking) {
        // Envoyer les données finales
        this.sendTrackingUpdate('leave');
        this.isTracking = false;
      }
    };

    // Événements de fermeture de page
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    // Événement de changement de page (SPA)
    window.addEventListener('popstate', handleUnload);
  }

  // Arrêter le tracking
  stopTracking() {
    this.isTracking = false;
    
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }

    // Envoyer les données finales
    this.sendTrackingUpdate('leave');
  }

  // Marquer comme rebond (visite très courte)
  markAsBounce() {
    if (this.isTracking) {
      this.sendTrackingUpdate('bounce');
      this.stopTracking();
    }
  }

  // Obtenir les métriques actuelles
  getMetrics() {
    if (!this.startTime) return null;

    return {
      timeOnPage: Math.floor((Date.now() - this.startTime) / 1000),
      scrollDepth: this.maxScrollDepth,
      isTracking: this.isTracking
    };
  }
}

// Instance singleton
const trackingService = new TrackingService();

export default trackingService;
