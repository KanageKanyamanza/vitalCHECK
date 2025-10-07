import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const EmailStatusIndicator = ({ 
  emailId, 
  recipient, 
  subject, 
  onStatusChange,
  showDetails = false 
}) => {
  const [status, setStatus] = useState('pending'); // pending, sending, sent, failed
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simuler le processus d'envoi d'email
    const simulateEmailSending = async () => {
      try {
        setStatus('sending');
        setProgress(0);
        
        // Toast de début
        toast.loading(`📧 Envoi en cours vers ${recipient}...`, {
          id: `email-${emailId}`,
          duration: 2000
        });

        // Simulation du progrès
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // Simuler le délai d'envoi
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Succès
        setStatus('sent');
        setProgress(100);
        clearInterval(progressInterval);

        toast.success(`✅ Email envoyé à ${recipient}`, {
          id: `email-${emailId}`,
          duration: 4000
        });

        if (onStatusChange) {
          onStatusChange(emailId, 'sent');
        }

      } catch (error) {
        setStatus('failed');
        setError(error.message);
        setProgress(0);

        toast.error(`❌ Échec d'envoi à ${recipient}`, {
          id: `email-${emailId}`,
          duration: 5000
        });

        if (onStatusChange) {
          onStatusChange(emailId, 'failed', error.message);
        }
      }
    };

    // Démarrer la simulation si le statut est pending
    if (status === 'pending') {
      simulateEmailSending();
    }
  }, [emailId, recipient, onStatusChange]);

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'sending':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Mail className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'text-gray-500 bg-gray-100';
      case 'sending':
        return 'text-blue-600 bg-blue-100';
      case 'sent':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'sending':
        return 'Envoi en cours...';
      case 'sent':
        return 'Envoyé';
      case 'failed':
        return 'Échec';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">{recipient}</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          {showDetails && (
            <div className="mt-1">
              <p className="text-xs text-gray-600 truncate max-w-xs">{subject}</p>
              {status === 'sending' && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{progress}%</p>
                </div>
              )}
              {status === 'failed' && error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {status === 'sending' && (
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailStatusIndicator;
