import React from 'react'
import { motion } from 'framer-motion'

const VitalCheckLogo = ({ 
  size = 'large', 
  showText = true, 
  animated = true,
  className = '',
  logoType = 'ms-icon' // 'ms-icon', 'favicon', 'apple-icon'
}) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24 md:w-32 md:h-32',
    xlarge: 'w-40 h-40 md:w-48 md:h-48'
  }

  const textSizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl',
    xlarge: 'text-5xl'
  }

  const logoPaths = {
    'ms-icon': '/ms-icon-310x310.png',
    'favicon': '/favicon-96x96.png',
    'apple-icon': '/apple-icon-180x180.png'
  }

  const logoVariants = {
    hidden: { 
      scale: 0.5, 
      rotate: -180,
      opacity: 0
    },
    visible: { 
      scale: 1, 
      rotate: 0,
      opacity: 1
    }
  }

  const textVariants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1 
    }
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Logo Image */}
      <motion.div
        variants={animated ? logoVariants : {}}
        initial={animated ? "hidden" : "visible"}
        animate="visible"
        transition={animated ? { 
          duration: 1.2, 
          ease: "easeOut", 
          delay: 0.2 
        } : {}}
        className={showText ? "mb-4" : ""}
      >
        <img 
          src={logoPaths[logoType]} 
          alt="VitalCheck Logo" 
          className={`${sizeClasses[size]} drop-shadow-2xl rounded-xl`}
        />
      </motion.div>
      
      {/* Logo Text */}
      {showText && (
        <motion.div
          variants={animated ? textVariants : {}}
          initial={animated ? "hidden" : "visible"}
          animate="visible"
          transition={animated ? { 
            duration: 0.8, 
            delay: 0.8 
          } : {}}
          className="  vitalcheck-gradient-text px-8 py-4 rounded-2xl"
        >
          {/* <h1 className={`${textSizes[size]} font-bold tracking-wider`}>
            VitalCheck
          </h1> */}
          <p className="text-2xl  vitalcheck-gradient-text font-medium text-center mt-1 opacity-90">
            Enterprise Health Check
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default VitalCheckLogo
