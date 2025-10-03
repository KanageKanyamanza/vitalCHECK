import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

const PerformanceAnalytics = () => {
  useEffect(() => {
    // Google Analytics 4 (remplacer par votre ID de tracking)
    const GA_TRACKING_ID = 'G-VOTRE_ID_ANALYTICS' // À remplacer par votre ID Google Analytics
    
    // Charger Google Analytics
    if (typeof window !== 'undefined' && GA_TRACKING_ID) {
      // Script Google Analytics
      const script1 = document.createElement('script')
      script1.async = true
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
      document.head.appendChild(script1)

      // Configuration Google Analytics
      const script2 = document.createElement('script')
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}', {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: true
        });
      `
      document.head.appendChild(script2)
    }

    // Google Search Console (remplacer par votre code de vérification)
    const GSC_VERIFICATION_CODE = 'your-verification-code' // À remplacer

    // Performance monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Mesurer le temps de chargement de la page
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0]
        if (perfData) {
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart
          const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
          
          // Envoyer les métriques de performance (exemple avec Google Analytics)
          if (typeof gtag !== 'undefined') {
            gtag('event', 'page_performance', {
              page_load_time: Math.round(loadTime),
              dom_content_loaded: Math.round(domContentLoaded),
              page_title: document.title,
              page_location: window.location.href
            })
          }
        }
      })
    }

    // Core Web Vitals monitoring
    if (typeof window !== 'undefined') {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'web_vitals', {
            metric_name: 'LCP',
            metric_value: Math.round(lastEntry.startTime),
            page_title: document.title,
            page_location: window.location.href
          })
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry) => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              metric_name: 'FID',
              metric_value: Math.round(entry.processingStart - entry.startTime),
              page_title: document.title,
              page_location: window.location.href
            })
          }
        })
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'web_vitals', {
            metric_name: 'CLS',
            metric_value: Math.round(clsValue * 1000),
            page_title: document.title,
            page_location: window.location.href
          })
        }
      }).observe({ entryTypes: ['layout-shift'] })
    }
  }, [])

  return (
    <Helmet>
      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="wbiaMLhjO90LdUV8ioVxnr6UXi0cci4NJyhfhj_xGW4" />
      
      {/* Bing Webmaster Tools */}
      <meta name="msvalidate.01" content="6205D13181308555152AFE16DF8E0A2D" />
      
      {/* Yandex Webmaster (optionnel) */}
      {/* <meta name="yandex-verification" content="VOTRE_CODE_YANDEX" /> */}
      
      {/* Baidu Verification (optionnel - pour la Chine) */}
      {/* <meta name="baidu-site-verification" content="VOTRE_CODE_BAIDU" /> */}
      
      {/* Facebook Domain Verification (optionnel) */}
      {/* <meta name="facebook-domain-verification" content="VOTRE_CODE_FACEBOOK" /> */}
      
      {/* Pinterest Verification (optionnel) */}
      {/* <meta name="pinterest-site-verification" content="VOTRE_CODE_PINTEREST" /> */}
      
      {/* LinkedIn Verification (optionnel) */}
      {/* <meta name="linkedin-verification" content="VOTRE_CODE_LINKEDIN" /> */}
    </Helmet>
  )
}

export default PerformanceAnalytics
