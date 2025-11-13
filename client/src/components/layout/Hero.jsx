import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CheckCircle } from 'lucide-react'
import bgHero from '../../assets/bg-hero-1.png'
import { BsFillPentagonFill } from "react-icons/bs";
import { BsPentagon } from "react-icons/bs";

const Hero = ({ onStartAssessment }) => {
  const { t } = useTranslation()

  return (
    <div 
    // className="min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center pt-16"
    className="min-h-screen bg-cover bg-center bg-no-repeat relative flex overflow-hidden"

    // style={{ backgroundImage: `url(${bgHero})` }}
    >
      {/* Hero Content */}
      <div className="max-w-7xl min-h-[100vh] bg-white/95 mx-auto py-[50px] relative z-10 w-full">
        <div className='md:flex'>
        <div className="text-center pt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className=" font-display font-bold mb-2 mt-1"
          >
            <span className="text-accent-500 text-5xl  sm:text-6xl">{t('landing.title1')}<BsFillPentagonFill className='inline-block size-7 md:mt-1' /><BsPentagon className='inline-block text-black size-7 -ml-3 md:mt-1 ' /></span>
            <br />
            <span className="text-primary-500 ml-4 text-3xl ">{t('landing.title2')}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-black max-w-3xl px-2 mx-auto font-semibold"
          >
            {t('landing.subtitle1')}
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-900 mb-2 max-w-3xl px-2 mx-auto"
            dangerouslySetInnerHTML={{ __html: t('landing.subtitle2') }}
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center space-x-2 text-sm text-black mb-12"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className='uppercase'>{t('landing.badge')}</span>
          </motion.div>

        </div>

        {/* Hero Image */}
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
         className='relative w-full h-[40vh] sm:h-[60vh] md:h-[80vh] md:mt-3'>
            <img src={bgHero} alt="vitalCHECK" className='w-full h-full object-fill' />
        </motion.div>
        
        

        </div>
        {/* CTA Button */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className='relative'
          >

            <div className='flex items-center justify-center space-x-2 text-sm text-black mb-12'>
              <div className='bg-white rounded-t-full h-[300px] w-[150px] p-2 border-2 border-black absolute -bottom-[300px] sm:-bottom-[250px] md:-bottom-[130px] md:left-10 left-2'>
                <div className='bg-white rounded-t-full h-[280px] w-[130px] p-2 border-2 border-black absolute bottom-0 left-0 right-0 mx-auto'>
                  <div className='bg-white rounded-t-full h-[260px] w-[110px] p-2 border-2 border-black absolute bottom-0 left-0 right-0 mx-auto'>
                    <div className='bg-white rounded-t-full h-[240px] w-[90px] p-2 border-2 border-black absolute bottom-0 left-0 right-0 mx-auto'>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='absolute md:-top-[40px] left-[170px] sm:left-[250px]'>
            <button
              onClick={onStartAssessment}
              className="bg-accent-500 hover:bg-accent-600 text-white font-semibold text-sm md:text-lg px-6 md:px-12 py-3 md:py-4 rounded-lg flex items-center space-x-2 md:space-x-3 mx-auto transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <span className="hidden md:inline">{t('landing.form.startButton')}</span>
              <span className="md:hidden">{t('landing.form.startButtonShort')}</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            </div>
          </motion.div>
      </div>
    </div>
  )
}

export default Hero
