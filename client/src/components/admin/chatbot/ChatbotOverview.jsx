import React, { useState, useEffect } from 'react';
import { adminApiService } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { 
  MessageCircle, 
  Users, 
  CheckCircle, 
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  TrendingUp
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Enregistrer les composants Chart.js
if (!ChartJS.registry.getScale('category')) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
}

const ChatbotOverview = ({ dateRange, onStatsUpdate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getChatbotStats(dateRange);
      setStats(response.data.stats);
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center text-gray-500">Aucune donnée disponible</div>;
  }

  const chartData = {
    labels: stats.dailyActivity.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Avec réponse',
        data: stats.dailyActivity.map(day => day.withResponse),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      },
      {
        label: 'Sans réponse',
        data: stats.dailyActivity.map(day => day.withoutResponse),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics - Simplified */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <MessageCircle className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total interactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInteractions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Users className="w-5 h-5 text-secondary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Utilisateurs uniques</p>
              <p className="text-2xl font-bold text-gray-900">{stats.uniqueUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Taux de réponse</p>
              <p className="text-2xl font-bold text-green-600">{stats.responseRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingQuestions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section - Simplified */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Feedback utilisateurs</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">{stats.feedback.useful} utiles</span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsDown className="w-4 h-4 text-red-600" />
            <span className="text-sm text-gray-700">{stats.feedback.useless} inutiles</span>
          </div>
        </div>
      </div>

      {/* Top Unanswered Questions - Simplified */}
      {stats.topUnanswered && stats.topUnanswered.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Questions fréquentes sans réponse</h3>
          <div className="space-y-2">
            {stats.topUnanswered.slice(0, 3).map((question, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{question.question}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {question.frequency}x • {new Date(question.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Chart - Simplified */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Activité (7 derniers jours)</h3>
        <div className="h-48">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ChatbotOverview;



