import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Save, 
  User,
  Mail,
  Camera,
  Eye,
  EyeOff,
  Edit3
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminApi } from '../../hooks/useAdminApi';

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Données de l'admin actuel
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    avatar: null,
    signature: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { loading: apiLoading, updateAdmin, uploadAvatar } = useAdminApi();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    const storedAdmin = localStorage.getItem('adminData');
    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      setAdminData(prev => ({
        ...prev,
        name: admin.name || '',
        email: admin.email || '',
        avatar: admin.avatar?.url || null,
        signature: admin.signature || ''
      }));
    }
  };

  const handleAdminUpdate = async () => {
    if (!adminData.name.trim() || !adminData.email.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (adminData.newPassword && adminData.newPassword !== adminData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        name: adminData.name,
        email: adminData.email,
        signature: adminData.signature
      };

      if (adminData.newPassword) {
        updateData.currentPassword = adminData.currentPassword;
        updateData.newPassword = adminData.newPassword;
      }

      await updateAdmin(updateData);
      
      const storedAdmin = JSON.parse(localStorage.getItem('adminData'));
      if (storedAdmin) {
        const updatedAdmin = { ...storedAdmin, ...updateData };
        localStorage.setItem('adminData', JSON.stringify(updatedAdmin));
      }
      
      toast.success('Profil mis à jour');
      
      setAdminData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Update admin error:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Max 5MB');
        return;
      }

      if (!file.type || !file.type.startsWith('image/')) {
        toast.error('Images uniquement');
        return;
      }

      try {
        setLoading(true);
        const response = await uploadAvatar(file);
        
        setAdminData(prev => ({
          ...prev,
          avatar: response.avatar.url
        }));

        const storedAdmin = JSON.parse(localStorage.getItem('adminData'));
        if (storedAdmin) {
          storedAdmin.avatar = response.avatar;
          localStorage.setItem('adminData', JSON.stringify(storedAdmin));
        }

        toast.success('Avatar mis à jour');
      } catch (error) {
        console.error('Upload avatar error:', error);
        toast.error('Erreur lors de l\'upload');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-5">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">
                    Paramètres
                </h1>
                <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">
                    Gestion du profil et des informations personnelles
                </p>
            </div>
        </div>

        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden p-6">
          <div className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-50">
              <div className="relative group">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                  {adminData.avatar ? (
                    <img src={adminData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 bg-primary-600 text-white rounded-full p-1.5 cursor-pointer hover:bg-primary-700 shadow-md transition-transform hover:scale-110">
                  <Camera className="w-3 h-3" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 leading-tight">Photo de profil</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Format JPG/PNG • Max 5MB</p>
              </div>
            </div>

            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={adminData.name}
                  onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-xs text-gray-900 font-bold"
                  placeholder="Votre nom complet"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest">
                  Email *
                </label>
                <input
                  type="email"
                  value={adminData.email}
                  onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-1.5 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-xs text-gray-900 font-bold"
                  placeholder="votre@email.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest flex items-center gap-2">
                  <Edit3 className="w-3.5 h-3.5" /> Signature
                </label>
                <textarea
                  value={adminData.signature}
                  onChange={(e) => setAdminData(prev => ({ ...prev, signature: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px] text-xs font-bold"
                  placeholder="Cordialement,&#10;Votre Nom"
                />
              </div>
            </div>

            {/* Changement de mot de passe */}
            <div className="border-t border-gray-50 pt-5">
              <h3 className="text-xs font-black text-gray-900 mb-3 uppercase tracking-widest">Sécurité</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={adminData.currentPassword}
                      onChange={(e) => setAdminData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-1.5 pr-10 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-xs font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5 text-gray-400" /> : <Eye className="h-3.5 w-3.5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={adminData.newPassword}
                        onChange={(e) => setAdminData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 py-1.5 pr-10 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showNewPassword ? <EyeOff className="h-3.5 w-3.5 text-gray-400" /> : <Eye className="h-3.5 w-3.5 text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest">
                      Confirmer
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={adminData.confirmPassword}
                        onChange={(e) => setAdminData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-1.5 pr-10 bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5 text-gray-400" /> : <Eye className="h-3.5 w-3.5 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleAdminUpdate}
                disabled={loading || apiLoading}
                className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-all shadow-lg shadow-primary-100 flex items-center text-xs font-black uppercase tracking-widest"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-3.5 w-3.5 mr-2" />
                )}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
