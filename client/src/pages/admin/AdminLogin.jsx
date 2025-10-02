import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail, Building2, ArrowLeft, Shield } from 'lucide-react';
import Logo from '../../assets/Logo.png';
import { adminApiService } from '../../services/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    console.log('🔐 [ADMIN LOGIN] handleSubmit called', { formData, loading });
    
    e.preventDefault();
    e.stopPropagation(); // Empêcher la propagation de l'événement
    
    console.log('🔐 [ADMIN LOGIN] Setting loading to true');
    setLoading(true);

    try {
      console.log('🔐 [ADMIN LOGIN] Calling adminApiService.login with:', formData);
      const response = await adminApiService.login(formData);
      console.log('🔐 [ADMIN LOGIN] Response received:', response);
      const data = response.data;

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        console.log('🔐 [ADMIN LOGIN] Admin data saved:', data.admin);
        toast.success('Connexion réussie !');
        navigate('/admin/dashboard');
      } else {
        toast.error(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Empêcher tout rechargement de page
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      } else if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 401) {
        toast.error('Email ou mot de passe incorrect');
      } else if (error.response && error.response.status >= 500) {
        toast.error('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        toast.error('Erreur de connexion. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-100 via-white to-accent-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%234CAF50%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10 mb-5 sm:mb-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-white/80 backdrop-blur-sm rounded-lg border border-primary-200 hover:bg-white hover:shadow-md transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </button>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center my-3 sm:my-0">
          <div className="mx-auto h-20 w-20 bg-accent-500 rounded-full flex items-center justify-center shadow-lg mb-4 p-1">
            <img 
              src={Logo} 
              alt="VitalCheck Logo" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 font-display">
            Connexion Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accédez au panneau d'administration VitalCheck
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 w-[90%] sm:w-full mx-auto backdrop-blur-sm py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit} onError={(e) => e.preventDefault()}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-primary-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="admin@VitalCheck.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-primary-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-primary-500 transition-colors duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-primary-500 transition-colors duration-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Se connecter
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-gray-500 font-medium">Accès sécurisé</span>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-6 bg-primary-50 border border-primary-200 rounded-xl p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Building2 className="h-5 w-5 text-primary-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-primary-800">
                  Accès Administrateur
                </h3>
                <div className="mt-1 text-sm text-primary-700">
                  <p>Cette interface est réservée aux administrateurs autorisés de l'VitalCheck Enterprise Health Check.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 VitalCheck Enterprise Health Check. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
