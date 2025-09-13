import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const UpdateNotification = ({ isVisible, onUpdate, onDismiss }) => {
  const { t } = useTranslation()

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5" />
              <div>
                <h3 className="font-semibold text-sm">
                  {t('pwa.updateAvailable.title', 'Mise à jour disponible')}
                </h3>
                <p className="text-xs opacity-90">
                  {t('pwa.updateAvailable.message', 'Une nouvelle version de l\'application est disponible.')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onUpdate}
                className="flex items-center space-x-1 px-3 py-1 bg-white text-primary-500 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t('pwa.updateAvailable.update', 'Mettre à jour')}</span>
              </button>
              
              <button
                onClick={onDismiss}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UpdateNotification
