import React from 'react'
import { useTranslation } from 'react-i18next'
import { Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const SocialShare = ({ url, title, description }) => {
  const { t } = useTranslation()
  const [copied, setCopied] = React.useState(false)

  // Utiliser l'URL actuelle si non fournie
  const shareUrl = url || window.location.href
  const shareTitle = title || document.title
  const shareDescription = description || ''

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success(t('socialShare.linkCopied'))
    setTimeout(() => setCopied(false), 2000)
  }

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
      icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
      color: '#0077B5'
    },
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' - ' + shareUrl)}`,
      icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
      color: '#25D366'
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      icon: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
      color: '#1DA1F2'
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: 'https://cdn-icons-png.flaticon.com/512/733/733547.png',
      color: '#1877F2'
    },
    {
      name: 'Email',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareDescription + '\n\n' + shareUrl)}`,
      icon: 'https://cdn-icons-png.flaticon.com/512/732/732200.png',
      color: '#EA4335'
    }
  ]

  return (
    <div className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {t('socialShare.title')}
          </h4>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                title={`${t('socialShare.shareOn')} ${social.name}`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden hover:scale-110 transition-transform duration-200 shadow-md hover:shadow-lg">
                  <img 
                    src={social.icon} 
                    alt={social.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Tooltip */}
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {social.name}
                </span>
              </a>
            ))}

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="group relative w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
              title={t('socialShare.copyLink')}
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-700" />
              )}
              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {copied ? t('socialShare.copied') : t('socialShare.copyLink')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialShare

