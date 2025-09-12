const express = require('express');
const router = express.Router();

// Route ping-pong pour vérifier la santé du serveur
router.get('/ping', (req, res) => {
  try {
    const startTime = process.hrtime();
    
    // Simulation d'une vérification rapide
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV || 'development'
    };

    // Calcul du temps de réponse
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const responseTime = seconds * 1000 + nanoseconds / 1000000;

    res.json({
      success: true,
      message: 'Pong! Server is healthy',
      data: {
        ...healthCheck,
        responseTime: `${responseTime.toFixed(2)}ms`
      }
    });

  } catch (error) {
    console.error('Ping error:', error);
    res.status(500).json({
      success: false,
      message: 'Server health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Route pong pour répondre au ping
router.post('/pong', (req, res) => {
  try {
    const { message, timestamp } = req.body;
    
    res.json({
      success: true,
      message: 'Pong received!',
      data: {
        originalMessage: message,
        receivedAt: new Date().toISOString(),
        originalTimestamp: timestamp,
        serverTime: Date.now()
      }
    });

  } catch (error) {
    console.error('Pong error:', error);
    res.status(500).json({
      success: false,
      message: 'Pong processing failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Route de test de charge pour simuler le chargement
router.get('/loading-test', (req, res) => {
  try {
    const { delay = 1000 } = req.query;
    const delayMs = Math.min(parseInt(delay), 5000); // Max 5 secondes

    setTimeout(() => {
      res.json({
        success: true,
        message: 'Loading test completed',
        data: {
          delay: delayMs,
          completedAt: new Date().toISOString()
        }
      });
    }, delayMs);

  } catch (error) {
    console.error('Loading test error:', error);
    res.status(500).json({
      success: false,
      message: 'Loading test failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
