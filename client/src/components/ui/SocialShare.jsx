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
    <div className="border-t border-ubb-brand-900/[0.06] bg-white py-8">
      <div className="ubb-container">
        <div className="text-center md:text-left">
          <h2 className="mb-4 font-heading text-lg font-semibold text-ubb-ink">
            {t('socialShare.title')}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ubb-focus group relative rounded-full"
                aria-label={`${t('socialShare.shareOn')} ${social.name}`}
                title={`${t('socialShare.shareOn')} ${social.name}`}
              >
                <div className="h-11 w-11 overflow-hidden rounded-full shadow-ubb-sm">
                  <img 
                    src={social.icon} 
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Tooltip */}
                <span aria-hidden="true" className="absolute -top-8 left-1/2 hidden -translate-x-1/2 transform bg-gray-900 md:block text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {social.name}
                </span>
              </a>
            ))}

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="ubb-focus group relative flex h-11 w-11 items-center justify-center rounded-full bg-ubb-mist text-ubb-ink shadow-ubb-sm transition-colors hover:bg-ubb-brand-200"
              aria-label={copied ? t('socialShare.copied') : t('socialShare.copyLink')}
              title={t('socialShare.copyLink')}
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-700" aria-hidden="true" />
              ) : (
                <Copy className="w-5 h-5" aria-hidden="true" />
              )}
              {/* Tooltip */}
              <span aria-hidden="true" className="absolute -top-8 left-1/2 hidden -translate-x-1/2 transform bg-gray-900 md:block text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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

