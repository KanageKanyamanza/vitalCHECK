import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Shield, 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Mail, 
  Lock, 
  User, 
  Edit2, 
  ShieldCheck, 
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Power
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdminApi } from '../../hooks/useAdminApi';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState(null); // Pour le rôle de l'utilisateur connecté
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Formulaire d'administration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    isActive: true,
    permissions: {
      viewUsers: true,
      manageUsers: true,
      viewAssessments: true,
      manageAssessments: true,
      sendEmails: true,
      viewReports: true,
      manageAdmins: false
    }
  });

  const [editingId, setEditingId] = useState(null);
  
  const navigate = useNavigate();
  const { 
    loading, 
    error, 
    getAdmins, 
    createAdmin, 
    updateAdminDetails, 
    deleteAdmin 
  } = useAdminApi();

  useEffect(() => {
    // Vérification locale du rôle
    const storedAdmin = localStorage.getItem('adminData');
    if (storedAdmin) {
      const parsed = JSON.parse(storedAdmin);
      setCurrentAdmin(parsed);
      if (parsed.role !== 'super-admin') {
        toast.error('Accès refusé. Cette page est réservée aux Super Administrateurs.');
        navigate('/admin/dashboard');
        return;
      }
    } else {
      navigate('/login');
      return;
    }

    fetchAdmins();
  }, [navigate]);

  const fetchAdmins = async () => {
    try {
      const response = await getAdmins();
      if (response && response.success) {
        setAdmins(response.admins);
      }
    } catch (err) {
      console.error('Fetch admins error:', err);
    }
  };

  const handleRoleChange = (selectedRole) => {
    // Adapter les permissions par défaut en fonction du rôle choisi
    const isSuper = selectedRole === 'super-admin';
    const isMod = selectedRole === 'moderator';

    setFormData(prev => ({
      ...prev,
      role: selectedRole,
      permissions: {
        viewUsers: true,
        manageUsers: !isMod,
        viewAssessments: true,
        manageAssessments: !isMod,
        sendEmails: !isMod,
        viewReports: true,
        manageAdmins: isSuper
      }
    }));
  };

  const handlePermissionToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key]
      }
    }));
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'admin',
      isActive: true,
      permissions: {
        viewUsers: true,
        manageUsers: true,
        viewAssessments: true,
        manageAssessments: true,
        sendEmails: true,
        viewReports: true,
        manageAdmins: false
      }
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (admin) => {
    setIsEditing(true);
    setEditingId(admin._id);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '', // Vide pour la modification par sécurité
      role: admin.role,
      isActive: admin.isActive,
      permissions: {
        viewUsers: admin.permissions?.viewUsers ?? true,
        manageUsers: admin.permissions?.manageUsers ?? true,
        viewAssessments: admin.permissions?.viewAssessments ?? true,
        manageAssessments: admin.permissions?.manageAssessments ?? true,
        sendEmails: admin.permissions?.sendEmails ?? true,
        viewReports: admin.permissions?.viewReports ?? true,
        manageAdmins: admin.permissions?.manageAdmins ?? false
      }
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Veuillez remplir le nom et l\'email.');
      return;
    }

    if (!isEditing && (!formData.password || formData.password.length < 6)) {
      toast.error('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    try {
      if (isEditing) {
        // Préparer les données pour la mise à jour (ne pas envoyer un mot de passe vide)
        const updateData = {
          name: formData.name,
          role: formData.role,
          isActive: formData.isActive,
          permissions: formData.permissions
        };
        if (formData.password && formData.password.trim().length >= 6) {
          updateData.password = formData.password;
        }

        const res = await updateAdminDetails(editingId, updateData);
        if (res && res.success) {
          toast.success('Administrateur mis à jour avec succès');
          setIsModalOpen(false);
          fetchAdmins();
        }
      } else {
        const res = await createAdmin(formData);
        if (res && res.success) {
          toast.success('Administrateur créé avec succès');
          setIsModalOpen(false);
          fetchAdmins();
        }
      }
    } catch (err) {
      console.error('Submit admin error:', err);
      // L'erreur est généralement affichée par le toast global dans api.js
    }
  };

  const handleDelete = async (admin) => {
    if (currentAdmin && admin._id === currentAdmin.id) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte.');
      return;
    }

    if (admin.role === 'super-admin') {
      const superAdmins = admins.filter(a => a.role === 'super-admin');
      if (superAdmins.length <= 1) {
        toast.error('Impossible de supprimer le dernier Super Administrateur.');
        return;
      }
    }

    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'administrateur ${admin.name} ?`)) {
      return;
    }

    try {
      const res = await deleteAdmin(admin._id);
      if (res && res.success) {
        toast.success('Administrateur supprimé avec succès');
        fetchAdmins();
      }
    } catch (err) {
      console.error('Delete admin error:', err);
    }
  };

  const toggleAdminStatus = async (admin) => {
    if (currentAdmin && admin._id === currentAdmin.id) {
      toast.error('Vous ne pouvez pas modifier votre propre statut.');
      return;
    }

    if (admin.role === 'super-admin' && admin.isActive) {
      const activeSuperAdmins = admins.filter(a => a.role === 'super-admin' && a.isActive);
      if (activeSuperAdmins.length <= 1) {
        toast.error('Impossible de désactiver le seul Super Administrateur actif.');
        return;
      }
    }

    try {
      const res = await updateAdminDetails(admin._id, { isActive: !admin.isActive });
      if (res && res.success) {
        toast.success(admin.isActive ? 'Administrateur désactivé' : 'Administrateur activé');
        fetchAdmins();
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super-admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-rose-50 text-rose-700 border border-rose-100 shadow-sm animate-pulse">
            <ShieldCheck className="w-3 h-3" />
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-primary-50 text-primary-700 border border-primary-100 shadow-sm">
            <Shield className="w-3 h-3" />
            Admin
          </span>
        );
      case 'moderator':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-amber-50 text-amber-700 border border-amber-100 shadow-sm">
            <ShieldAlert className="w-3 h-3" />
            Modérateur
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-gray-50 text-gray-700 border border-gray-100 shadow-sm">
            Admin
          </span>
        );
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getAvatarBg = (name) => {
    const colours = [
      'bg-gradient-to-tr from-primary-600 to-indigo-500 text-white',
      'bg-gradient-to-tr from-rose-600 to-pink-500 text-white',
      'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white',
      'bg-gradient-to-tr from-amber-500 to-orange-500 text-white',
      'bg-gradient-to-tr from-violet-600 to-purple-500 text-white'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colours[sum % colours.length];
  };

  if (currentAdmin && currentAdmin.role !== 'super-admin') {
    return null; // Redirection gérée par useEffect
  }

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-none uppercase flex items-center gap-2">
              <Shield className="w-6 h-6 text-rose-600" />
              Gestion des Admins
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-2">
              Création, surveillance et gestion des rôles de l'équipe d'administration
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdmins}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-primary-600 bg-white border border-gray-100 hover:border-primary-100 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
              title="Rafraîchir"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              <Plus className="w-4 h-4" />
              Créer un Admin
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white shadow-md rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Administrateur
                  </th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Rôle
                  </th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Permissions Clés
                  </th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Statut
                  </th>
                  <th className="px-6 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-3.5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 font-bold">
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50/50 transition-colors group">
                    
                    {/* Nom / Email / Avatar */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shadow-sm ${getAvatarBg(admin.name)}`}>
                          {admin.avatar?.url ? (
                            <img 
                              src={admin.avatar.url} 
                              alt={admin.name} 
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            getInitials(admin.name)
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-gray-900 leading-tight">
                            {admin.name} {currentAdmin && admin._id === currentAdmin.id && (
                              <span className="text-[9px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 px-1 py-0.5 rounded ml-1.5 border border-rose-100">Moi</span>
                            )}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{admin.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Rôle Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(admin.role)}
                    </td>

                    {/* Permissions clées */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {admin.permissions?.manageAdmins && (
                          <span className="inline-flex px-1.5 py-0.5 text-[8px] font-black rounded bg-red-50 text-red-600 border border-red-100 uppercase tracking-tight">Admins</span>
                        )}
                        {admin.permissions?.manageUsers && (
                          <span className="inline-flex px-1.5 py-0.5 text-[8px] font-black rounded bg-primary-50 text-primary-600 border border-primary-100 uppercase tracking-tight">Membres</span>
                        )}
                        {admin.permissions?.manageAssessments && (
                          <span className="inline-flex px-1.5 py-0.5 text-[8px] font-black rounded bg-accent-50 text-accent-600 border border-accent-100 uppercase tracking-tight">Évals</span>
                        )}
                        {admin.permissions?.sendEmails && (
                          <span className="inline-flex px-1.5 py-0.5 text-[8px] font-black rounded bg-pink-50 text-pink-600 border border-pink-100 uppercase tracking-tight">Mails</span>
                        )}
                        {!admin.permissions?.manageUsers && !admin.permissions?.manageAssessments && !admin.permissions?.sendEmails && !admin.permissions?.manageAdmins && (
                          <span className="inline-flex px-1.5 py-0.5 text-[8px] font-black rounded bg-gray-50 text-gray-400 border border-gray-100 uppercase tracking-tight">Lecture Seule</span>
                        )}
                      </div>
                    </td>

                    {/* Statut Toggle */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleAdminStatus(admin)}
                        disabled={currentAdmin && admin._id === currentAdmin.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black rounded-lg border transition-all ${
                          admin.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/70'
                            : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100/70'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Power className="w-3 h-3" />
                        {admin.isActive ? 'ACTIF' : 'INACTIF'}
                      </button>
                    </td>

                    {/* Dernière connexion */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[10px] text-gray-500">
                        {admin.lastLogin 
                          ? new Date(admin.lastLogin).toLocaleString('fr-FR', {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })
                          : 'Jamais connecté'
                        }
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(admin)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100/80 rounded-lg transition-all"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(admin)}
                          disabled={currentAdmin && admin._id === currentAdmin.id}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-gray-100/80 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
                {admins.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                        <span className="text-xs text-gray-500 uppercase tracking-widest font-black">Aucun administrateur trouvé</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de création / modification */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-slideUp">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                <div>
                  <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase">
                    {isEditing ? 'Modifier l\'administrateur' : 'Créer un administrateur'}
                  </h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    {isEditing ? 'Mise à jour des informations de compte' : 'Définition d\'un nouvel accès administrateur'}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit}>
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                  
                  {/* Nom complet */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-wider leading-none">
                      Nom complet
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Jean Dupont"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-9 w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-xs font-bold text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Adresse Email */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-wider leading-none">
                      Adresse Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        disabled={isEditing}
                        placeholder="Ex: jean.dupont@vitalcheck.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-9 w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-xs font-bold text-gray-900 disabled:opacity-65"
                      />
                    </div>
                  </div>

                  {/* Mot de passe */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-wider leading-none">
                      Mot de passe {isEditing && <span className="text-[9px] font-medium lowercase text-gray-400">(laisser vide pour ne pas modifier)</span>}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        placeholder="Min. 6 caractères"
                        required={!isEditing}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-9 w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-xs font-bold text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Sélection du rôle */}
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-wider leading-none">
                        Rôle de sécurité
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-xs font-black uppercase text-gray-900"
                      >
                        <option value="moderator">Modérateur</option>
                        <option value="admin">Administrateur</option>
                        <option value="super-admin">Super Administrateur</option>
                      </select>
                    </div>

                    {/* Statut du compte */}
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-wider leading-none">
                        Statut du compte
                      </label>
                      <div className="flex items-center h-9">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formData.isActive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                          <span className="ml-2 text-xs font-bold text-gray-700">
                            {formData.isActive ? 'Actif' : 'Désactivé'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Gestion des permissions fines */}
                  <div className="pt-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider leading-none">
                      Permissions personnalisées
                    </label>
                    <div className="bg-gray-50 border border-gray-150 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      
                      <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.permissions.viewUsers}
                          onChange={() => handlePermissionToggle('viewUsers')}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                        <span className="font-bold text-gray-700">Voir utilisateurs</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.permissions.manageUsers}
                          onChange={() => handlePermissionToggle('manageUsers')}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                        <span className="font-bold text-gray-700">Gérer utilisateurs</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.permissions.viewAssessments}
                          onChange={() => handlePermissionToggle('viewAssessments')}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                        <span className="font-bold text-gray-700">Voir évaluations</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.permissions.manageAssessments}
                          onChange={() => handlePermissionToggle('manageAssessments')}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                        <span className="font-bold text-gray-700">Gérer évaluations</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.permissions.sendEmails}
                          onChange={() => handlePermissionToggle('sendEmails')}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                        <span className="font-bold text-gray-700">Envoyer des emails</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.permissions.viewReports}
                          onChange={() => handlePermissionToggle('viewReports')}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                        <span className="font-bold text-gray-700">Voir rapports</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-white transition-colors col-span-1 sm:col-span-2 border-t border-gray-200 mt-1 pt-2">
                        <input
                          type="checkbox"
                          disabled={formData.role !== 'super-admin'}
                          checked={formData.permissions.manageAdmins}
                          onChange={() => handlePermissionToggle('manageAdmins')}
                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer disabled:opacity-50"
                        />
                        <span className={`font-bold ${formData.role === 'super-admin' ? 'text-rose-600 font-extrabold' : 'text-gray-400'}`}>
                          Gérer les administrateurs (Super Admin)
                        </span>
                      </label>

                    </div>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100 bg-gray-50/50">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 text-xs font-black uppercase tracking-wider text-gray-600 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm hover:shadow transition-all disabled:opacity-50"
                  >
                    {loading ? 'Traitement...' : isEditing ? 'Sauvegarder' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminManagement;
