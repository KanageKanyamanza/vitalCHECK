import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Settings, 
  Save, 
  User,
  Mail,
  Bell,
  Shield,
  Database,
  Globe,
  Key,
  Trash2,
  UserPlus,
  Camera,
  Eye,
  EyeOff,
  Edit3,
  X
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminApi } from '../../hooks/useAdminApi';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [currentAdminRole, setCurrentAdminRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  
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

  // Données pour créer un nouvel admin
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });

  // Liste des admins existants
  const [admins, setAdmins] = useState([]);

  const { loading: apiLoading, error, updateAdmin, createAdmin, getAdmins, deleteAdmin, uploadAvatar } = useAdminApi();

  useEffect(() => {
    loadAdminData();
    loadAdmins();
  }, []);

  useEffect(() => {
    if (activeTab === 'admins' && currentAdminRole !== 'superadmin') {
      setActiveTab('profile');
    }
  }, [activeTab, currentAdminRole]);

  const loadAdminData = () => {
    const storedAdmin = localStorage.getItem('adminData');
    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      setCurrentAdminRole(admin.role || 'admin');
      setAdminData(prev => ({
        ...prev,
        name: admin.name || '',
        email: admin.email || '',
        avatar: admin.avatar?.url || null,
        signature: admin.signature || ''
      }));
    }
  };

  const loadAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data.admins || []);
    } catch (error) {
      console.error('Error loading admins:', error);
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

  const handleCreateAdmin = async () => {
    if (!newAdmin.name.trim() || !newAdmin.email.trim() || !newAdmin.password.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setLoading(true);
      await createAdmin(newAdmin);
      toast.success('Administrateur créé');
      setShowCreateAdmin(false);
      setNewAdmin({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'admin'
      });
      loadAdmins();
    } catch (error) {
      console.error('Create admin error:', error);
      toast.error('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      try {
        await deleteAdmin(adminId);
        toast.success('Administrateur supprimé');
        loadAdmins();
      } catch (error) {
        console.error('Delete admin error:', error);
        toast.error('Erreur lors de la suppression');
      }
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

  const tabs = [
    { id: 'profile', name: 'Mon Profil', icon: User },
    ...(currentAdminRole === 'superadmin' ? [{ id: 'admins', name: 'Administrateurs', icon: UserPlus }] : []),
  ];

  const renderProfileTab = () => (
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
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Format JPG/PNG • Max 2MB</p>
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
  );

  const renderAdminsTab = () => (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div>
          <h3 className="text-sm font-black text-gray-900 leading-tight">Gestion des accès</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Comptes administrateurs</p>
        </div>
        <button
          onClick={() => setShowCreateAdmin(true)}
          className="bg-primary-600 text-white px-4 py-1.5 rounded-lg hover:bg-primary-700 flex items-center text-xs font-black transition-all shadow-md shadow-primary-50"
        >
          <UserPlus className="h-3.5 w-3.5 mr-2" />
          Nouveau
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin</th>
                <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                <th className="px-4 py-2 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Rôle</th>
                <th className="px-4 py-2 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                        {admin.avatar?.url ? (
                          <img src={admin.avatar.url} alt={admin.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-xs font-black text-gray-900">{admin.name}</div>
                        <div className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Créé {new Date(admin.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-xs font-bold text-gray-600">
                    {admin.email}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="inline-flex px-1.5 py-0.5 text-[9px] font-black rounded-full bg-primary-50 text-primary-700 border border-primary-100 uppercase tracking-widest">
                      {admin.role || 'admin'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="p-1 px-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded transition-all border border-transparent hover:border-gray-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateAdmin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary-600" />
                Nouvel Administrateur
              </h3>
              <button
                onClick={() => setShowCreateAdmin(false)}
                className="p-2 text-gray-400 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest">Nom complet *</label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest">Email *</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest">Pass *</label>
                  <input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest">Confirmer *</label>
                  <input
                    type="password"
                    value={newAdmin.confirmPassword}
                    onChange={(e) => setNewAdmin(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 overflow-hidden border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowCreateAdmin(false)}
                className="flex-1 py-2 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
              > Annuler </button>
              <button
                onClick={handleCreateAdmin}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-100 transition-all flex items-center justify-center"
              > {loading ? 'En cours...' : 'Créer'} </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'admins': return currentAdminRole === 'superadmin' ? renderAdminsTab() : renderProfileTab();
      default: return renderProfileTab();
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
                    Gestion du profil et des accès système
                </p>
            </div>
        </div>

        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
            {/* Tabs Navigation */}
            <div className="border-b border-gray-50 bg-gray-50/30 px-2 flex gap-1 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 px-4 flex items-center gap-2 transition-all border-b-2 font-black text-[10px] uppercase tracking-widest ${
                            activeTab === tab.id
                                ? 'border-primary-600 text-primary-600 bg-white shadow-sm'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {renderTabContent()}
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
