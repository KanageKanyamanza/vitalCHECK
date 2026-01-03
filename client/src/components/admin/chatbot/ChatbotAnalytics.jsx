import React, { useState, useEffect } from 'react';
import { adminApiService } from '../../../services/api';
import { toast } from 'react-hot-toast';
import { TrendingUp, Target, Clock, MessageCircle } from 'lucide-react';
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

const ChatbotAnalytics = ({ dateRange }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminApiService.getChatbotAnalytics(dateRange);
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Erreur lors du chargement des analytics');
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

  if (!analytics) {
    return <div className="text-center text-gray-500">Aucune donnée disponible</div>;
  }

  const hourlyChartData = {
    labels: analytics.hourlyActivity.map(item => `${item.hour}h`),
    datasets: [{
      label: 'Activité',
      data: analytics.hourlyActivity.map(item => item.count),
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      borderDash: [5, 5],
      tension: 0.4
    }]
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Croissance</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.growth}%</p>
              <p className="text-xs text-gray-500 mt-1">vs période précédente</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taux de satisfaction</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{analytics.satisfactionRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Basé sur les feedbacks</p>
            </div>
            <Target className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Temps de réponse</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{analytics.avgResponseTime}ms</p>
              <p className="text-xs text-gray-500 mt-1">Moyenne</p>
            </div>
            <Clock className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Questions posées</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics.mostFrequent?.reduce((sum, q) => sum + q.count, 0) || 0}
              </p>
            </div>
            <MessageCircle className="w-12 h-12 text-gray-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Types de questions */}
      {analytics.questionTypes && analytics.questionTypes.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Types de questions</h3>
          <div className="space-y-3">
            {analytics.questionTypes.map((type, index) => {
              const total = analytics.questionTypes.reduce((sum, t) => sum + t.count, 0);
              const percentage = total > 0 ? ((type.count / total) * 100).toFixed(1) : 0;
              const typeLabels = {
                'intent': 'Intention',
                'faq': 'FAQ',
                'no_answer': 'Sans réponse',
                'custom': 'Personnalisée'
              };
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {typeLabels[type._id] || type._id}
                    </span>
                    <span className="text-sm text-gray-600">{type.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Activité par heure */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité par heure</h3>
        <div className="h-64">
          <Line
            data={hourlyChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      {/* Questions les plus fréquentes */}
      {analytics.mostFrequent && analytics.mostFrequent.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions les plus fréquentes</h3>
          <div className="space-y-2">
            {analytics.mostFrequent.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-primary-600">#{index + 1}</span>
                  <span className="text-sm text-gray-700">{item.question}</span>
                </div>
                <span className="text-sm text-gray-500">{item.count}x posée</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotAnalytics;



