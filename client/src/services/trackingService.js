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
    this.visitId = visitId;
    this.startTime = Date.now();
    this.scrollDepth = 0;
    this.maxScrollDepth = 0;
    this.isTracking = true;

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
    let lastScrollPercent = 0;
    let scrollUpdateCount = 0;

    const updateScrollDepth = () => {
      if (!this.isTracking) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

      this.scrollDepth = Math.min(scrollPercent, 100);
      this.maxScrollDepth = Math.max(this.maxScrollDepth, this.scrollDepth);

      // Ne pas envoyer de mise à jour si le scroll n'a pas changé significativement
      if (Math.abs(scrollPercent - lastScrollPercent) < 5) {
        return;
      }

      lastScrollPercent = scrollPercent;
      scrollUpdateCount++;

      // Limiter la fréquence des mises à jour
      if (scrollUpdateCount % 3 !== 0) {
        return;
      }

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
    // Mettre à jour le temps toutes les 60 secondes (réduire la fréquence)
    this.timeInterval = setInterval(() => {
      if (this.isTracking) {
        this.sendTrackingUpdate();
      }
    }, 60000);
  }

  // Envoyer les données de tracking au serveur
  async sendTrackingUpdate(action = 'update') {
    if (!this.visitId || !this.isTracking) {
      return;
    }

    // Debouncing : éviter les requêtes trop fréquentes
    if (this.lastUpdateTime && Date.now() - this.lastUpdateTime < 2000) {
      return;
    }

    try {
      const timeOnPage = Math.floor((Date.now() - this.startTime) / 1000);
      
      
      await blogApiService.trackVisit(this.visitId, {
        timeOnPage,
        scrollDepth: this.maxScrollDepth,
        action
      });
      
      this.lastUpdateTime = Date.now();
    } catch (error) {
      // Erreur silencieuse pour le tracking
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

// Rendre le service accessible globalement pour les hooks
if (typeof window !== 'undefined') {
  window.trackingService = trackingService;
}

export default trackingService;
