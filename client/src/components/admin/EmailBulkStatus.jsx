import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Mail, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Users,
  BarChart3
} from 'lucide-react';
import EmailStatusIndicator from './EmailStatusIndicator';

const EmailBulkStatus = ({ 
  emails = [], 
  onComplete,
  showProgress = true 
}) => {
  const [emailStatuses, setEmailStatuses] = useState({});
  const [overallStatus, setOverallStatus] = useState('pending'); // pending, sending, completed, failed
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    failed: 0,
    pending: 0
  });

  useEffect(() => {
    // Initialiser les statuts
    const initialStatuses = {};
    emails.forEach((email, index) => {
      initialStatuses[email.id || index] = 'pending';
    });
    setEmailStatuses(initialStatuses);
    setStats({
      total: emails.length,
      sent: 0,
      failed: 0,
      pending: emails.length
    });
  }, [emails]);

  useEffect(() => {
    // Calculer les statistiques
    const newStats = {
      total: emails.length,
      sent: 0,
      failed: 0,
      pending: 0
    };

    Object.values(emailStatuses).forEach(status => {
      switch (status) {
        case 'sent':
          newStats.sent++;
          break;
        case 'failed':
          newStats.failed++;
          break;
        default:
          newStats.pending++;
      }
    });

    setStats(newStats);

    // Déterminer le statut global
    if (newStats.pending === 0) {
      if (newStats.failed === 0) {
        setOverallStatus('completed');
        toast.success(`✅ Tous les emails ont été envoyés avec succès ! (${newStats.sent}/${newStats.total})`);
      } else if (newStats.sent === 0) {
        setOverallStatus('failed');
        toast.error(`❌ Tous les emails ont échoué (${newStats.failed}/${newStats.total})`);
      } else {
        setOverallStatus('completed');
        toast.success(`✅ Envoi terminé : ${newStats.sent} réussis, ${newStats.failed} échoués`);
      }
      
      if (onComplete) {
        onComplete(newStats);
      }
    } else if (newStats.sent > 0 || newStats.failed > 0) {
      setOverallStatus('sending');
    }
  }, [emailStatuses, emails.length, onComplete]);

  const handleStatusChange = (emailId, status, error = null) => {
    setEmailStatuses(prev => ({
      ...prev,
      [emailId]: status
    }));
  };

  const getOverallStatusIcon = () => {
    switch (overallStatus) {
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'sending':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Mail className="h-5 w-5 text-gray-400" />;
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      case 'sending':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getOverallStatusText = () => {
    switch (overallStatus) {
      case 'pending':
        return 'En attente';
      case 'sending':
        return 'Envoi en cours';
      case 'completed':
        return 'Terminé';
      case 'failed':
        return 'Échec';
      default:
        return 'Inconnu';
    }
  };

  const progressPercentage = stats.total > 0 ? ((stats.sent + stats.failed) / stats.total) * 100 : 0;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Header avec statut global */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {getOverallStatusIcon()}
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Envoi d'emails en cours
            </h3>
            <p className="text-sm text-gray-600">
              {getOverallStatusText()} • {stats.total} destinataires
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getOverallStatusColor()}`}>
          {getOverallStatusText()}
        </div>
      </div>

      {/* Barre de progression */}
      {showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className="text-sm text-gray-500">
              {stats.sent + stats.failed}/{stats.total} ({Math.round(progressPercentage)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
            <span className="text-2xl font-bold text-green-600">{stats.sent}</span>
          </div>
          <p className="text-sm text-green-700">Envoyés</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <XCircle className="h-5 w-5 text-red-500 mr-1" />
            <span className="text-2xl font-bold text-red-600">{stats.failed}</span>
          </div>
          <p className="text-sm text-red-700">Échoués</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Clock className="h-5 w-5 text-gray-500 mr-1" />
            <span className="text-2xl font-bold text-gray-600">{stats.pending}</span>
          </div>
          <p className="text-sm text-gray-700">En attente</p>
        </div>
      </div>

      {/* Liste des emails */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {emails.map((email, index) => (
          <EmailStatusIndicator
            key={email.id || index}
            emailId={email.id || index}
            recipient={email.to || email.recipient || `Utilisateur ${index + 1}`}
            subject={email.subject || 'Sans objet'}
            onStatusChange={handleStatusChange}
            showDetails={true}
          />
        ))}
      </div>

      {/* Message de fin */}
      {overallStatus === 'completed' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-green-800">
                Envoi terminé avec succès
              </h4>
              <p className="text-sm text-green-700 mt-1">
                {stats.sent} email(s) envoyé(s) sur {stats.total} destinataire(s)
                {stats.failed > 0 && `, ${stats.failed} échec(s)`}
              </p>
            </div>
          </div>
        </div>
      )}

      {overallStatus === 'failed' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-red-800">
                Échec de l'envoi
              </h4>
              <p className="text-sm text-red-700 mt-1">
                Aucun email n'a pu être envoyé. Vérifiez la configuration du serveur.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailBulkStatus;
