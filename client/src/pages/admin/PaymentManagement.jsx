import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Search, 
  Mail, 
  Check, 
  Clock, 
  AlertCircle,
  Send,
  Eye,
  Filter,
  Download,
  ShieldAlert,
  X
} from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { adminApiService } from '../../services/api'

// Motifs de blocage d'un paiement Mobile Money (champ failureReason)
const CONFLICT_REASONS = [
  ['final_status_conflict_SUCCESS', 'Annoncé réussi après avoir été enregistré comme échoué'],
  ['final_status_conflict_FAILED', 'Annoncé échoué après avoir été confirmé'],
  ['webhook_amount_mismatch', 'Montant ou devise du webhook différent de la commande'],
  ['amount_mismatch', 'Montant ou devise différent de la commande'],
  ['country_mismatch', 'Pays différent de la commande'],
  ['webhook_', 'Webhook et statut AfribaPay contradictoires'],
  ['transaction_id', 'Identifiant de transaction déjà utilisé ou différent'],
  ['order_id_mismatch', 'Identifiant de commande différent'],
  ['user_not_found', 'Compte client introuvable'],
]
const conflictLabel = (reason = '') =>
  CONFLICT_REASONS.find(([prefix]) => reason.startsWith(prefix))?.[1] || reason || 'Motif inconnu'

const OPERATOR_NAMES = { orange: 'Orange Money', wave: 'Wave', free: 'Free Money', emoney: 'E-money' }

// 221700000001 -> 2217******01
const maskPhone = (phone = '') => (phone.length > 6 ? `${phone.slice(0, 4)}${'*'.repeat(phone.length - 6)}${phone.slice(-2)}` : phone)

const formatAmount = (amount, currency) =>
  currency === 'XOF'
    ? `${Number(amount || 0).toLocaleString('fr-FR')} FCFA`
    : `${Number(amount || 0).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${currency === 'USD' ? '$' : currency || ''}`

const PaymentManagement = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  })

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await adminApiService.getPayments()
      setPayments(response.data.payments || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.error('Erreur lors du chargement des paiements')
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async (payment) => {
    setSelectedPayment(payment)
    setEmailData({
      subject: `vitalCHECK - Confirmation de votre abonnement ${payment.planName}`,
      message: `Bonjour,\n\nNous avons bien reçu votre paiement pour le plan ${payment.planName}.\n\nNos experts vont vous contacter sous peu pour organiser vos services.\n\nCordialement,\nL'équipe vitalCHECK`
    })
    setShowEmailModal(true)
  }

  const sendEmail = async () => {
    try {
      const response = await adminApiService.sendPaymentEmail(selectedPayment._id, emailData)
      
      toast.success('Email envoyé avec succès! Paiement marqué comme traité.')
      setShowEmailModal(false)
      
      // Update payment status in UI
      setPayments(payments.map(p => 
        p._id === selectedPayment._id 
          ? { ...p, emailSent: true, emailSentAt: new Date(), status: 'processed' }
          : p
      ))
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Erreur lors de l\'envoi de l\'email')
    }
  }

  const markAsProcessed = async (paymentId) => {
    try {
      await adminApiService.updatePaymentStatus(paymentId, 'processed')
      
      toast.success('Paiement marqué comme traité')
      fetchPayments()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  // Paiement Mobile Money « à examiner » : décision prise après vérification dans le tableau de bord AfribaPay
  const resolvePayment = async (payment, action) => {
    const question = action === 'activate'
      ? `Activer l'offre ${payment.planName} pour ${payment.customerEmail} ?\n\nÀ faire seulement si le paiement ${payment.orderId} apparaît comme réussi dans le tableau de bord AfribaPay.`
      : `Rejeter le paiement ${payment.orderId} ? L'offre ne sera pas activée.`
    if (!window.confirm(question)) return
    try {
      await adminApiService.resolveMobileMoneyPayment(payment._id, action)
      toast.success(action === 'activate' ? 'Paiement activé, offre appliquée' : 'Paiement rejeté')
      fetchPayments()
    } catch (error) {
      console.error('Error resolving payment:', error)
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour')
    }
  }

  const exportPayments = async () => {
    try {
      const response = await adminApiService.exportPayments()
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `payments-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success('Export réussi!')
    } catch (error) {
      console.error('Error exporting:', error)
      toast.error('Erreur lors de l\'export')
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.planName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'review' ? payment.conflict : payment.status === filterStatus)

    return matchesSearch && matchesFilter
  })

  const toReviewCount = payments.filter(p => p.conflict).length

  // Revenus encaissés (paiements confirmés), par devise : dollars et FCFA ne s'additionnent pas
  const revenueByCurrency = payments
    .filter(p => ['completed', 'processed'].includes(p.status) && !p.conflict)
    .reduce((acc, p) => ({ ...acc, [p.currency]: (acc[p.currency] || 0) + (p.amount || 0) }), {})

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente', icon: Clock },
      completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Confirmé', icon: Check },
      processed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Traité', icon: Check },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Échoué', icon: AlertCircle }
    }
    const badge = badges[status] || badges.pending
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    )
  }

  const getPlanBadge = (planId) => {
    const badges = {
      standard: { bg: 'bg-blue-100', text: 'text-blue-800' },
      premium: { bg: 'bg-purple-100', text: 'text-purple-800' },
      diagnostic: { bg: 'bg-yellow-100', text: 'text-yellow-800' }
    }
    return badges[planId] || badges.standard
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
            <DollarSign className="w-8 h-8 mr-3 text-primary-600" />
            Gestion des Paiements
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez les paiements et envoyez des emails aux clients
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total Paiements</div>
            <div className="text-2xl font-bold text-gray-900">{payments.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <div className="text-sm text-green-600">Traités</div>
            <div className="text-2xl font-bold text-green-900">
              {payments.filter(p => p.status === 'processed').length}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <div className="text-sm text-yellow-600">En attente</div>
            <div className="text-2xl font-bold text-yellow-900">
              {payments.filter(p => p.status === 'pending').length}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFilterStatus('review')}
            className={`text-left rounded-lg shadow p-4 ${toReviewCount ? 'bg-red-50' : 'bg-white'}`}
          >
            <div className={`text-sm ${toReviewCount ? 'text-red-700' : 'text-gray-600'}`}>À examiner</div>
            <div className={`text-2xl font-bold ${toReviewCount ? 'text-red-900' : 'text-gray-900'}`}>{toReviewCount}</div>
          </button>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <div className="text-sm text-blue-600">Revenus encaissés</div>
            <div className="text-xl font-bold text-blue-900">
              {Object.keys(revenueByCurrency).length === 0
                ? '0'
                : Object.entries(revenueByCurrency).map(([currency, total]) => (
                  <div key={currency}>{formatAmount(total, currency)}</div>
                ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par email, ID de commande..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="review">À examiner</option>
                <option value="pending">En attente</option>
                <option value="completed">Confirmés</option>
                <option value="processed">Traités</option>
                <option value="failed">Échoués</option>
              </select>

              <button
                onClick={exportPayments}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      Aucun paiement trouvé
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => {
                    const planBadge = getPlanBadge(payment.planId)
                    return (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                          <div className="text-xs text-gray-500">
                            {new Date(payment.createdAt).toLocaleTimeString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.customerEmail}
                          </div>
                          <div className="text-xs text-gray-500">
                            {payment.orderId}
                          </div>
                          {payment.provider === 'afribapay' && (
                            <div className="text-xs text-gray-500">
                              {OPERATOR_NAMES[payment.operator] || payment.operator} · {maskPhone(payment.phoneNumber)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${planBadge.bg} ${planBadge.text}`}>
                            {payment.planName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatAmount(payment.amount, payment.currency)}
                        </td>
                        <td className="px-6 py-4">
                          {payment.conflict ? (
                            <>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <ShieldAlert className="w-3 h-3 mr-1" />
                                À examiner
                              </span>
                              <div className="mt-1 max-w-[220px] text-xs text-red-700">
                                {conflictLabel(payment.failureReason)}
                              </div>
                            </>
                          ) : (
                            getStatusBadge(payment.status)
                          )}
                          {payment.reviewDecision && (
                            <div className="mt-1 text-xs text-gray-500">
                              {payment.reviewDecision === 'activated' ? 'Activé' : 'Rejeté'} par {payment.reviewedBy}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {payment.emailSent ? (
                            <span className="flex items-center text-xs text-green-600">
                              <Check className="w-3 h-3 mr-1" />
                              Envoyé
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Non envoyé</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSendEmail(payment)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Envoyer un email"
                            >
                              <Mail className="w-5 h-5" />
                            </button>
                            {payment.conflict && (
                              <>
                                <button
                                  onClick={() => resolvePayment(payment, 'activate')}
                                  className="inline-flex min-h-[36px] items-center rounded-md bg-green-600 px-2.5 text-xs font-medium text-white hover:bg-green-700"
                                  title="Activer l'offre (paiement vérifié chez AfribaPay)"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Activer
                                </button>
                                <button
                                  onClick={() => resolvePayment(payment, 'reject')}
                                  className="inline-flex min-h-[36px] items-center rounded-md border border-gray-300 px-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                                  title="Rejeter sans activer"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Rejeter
                                </button>
                              </>
                            )}
                            {/* Mobile Money : statut fixé par AfribaPay, jamais à la main (sinon le client verrait « confirmé » sans offre active) */}
                            {payment.status === 'pending' && payment.provider !== 'afribapay' && (
                              <button
                                onClick={() => markAsProcessed(payment._id)}
                                className="text-green-600 hover:text-green-900"
                                title="Marquer comme traité"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
            >
              <h3 className="md:text-lg sm:text-md text-xs font-bold mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary-600" />
                Envoyer un email à {selectedPayment?.customerEmail}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="10"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    value={emailData.message}
                    onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={sendEmail}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default PaymentManagement

