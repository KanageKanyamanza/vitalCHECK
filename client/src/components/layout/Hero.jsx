import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Button, Container } from '../ui/ds'
import HeroScoreCard from '../landing/HeroScoreCard'
import heroImage from '../../assets/landing/hero-consultation.webp'
import heroImageSmall from '../../assets/landing/hero-consultation-640.webp'

const REASSURANCE_KEYS = ['free', 'questions', 'instant']

const Hero = () => {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()

  // Une seule séquence d'entrée, orchestrée au chargement
  const enter = (delay) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: 'easeOut' },
        }

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-b-[2rem] bg-ubb-brand-900 text-white sm:rounded-b-[3rem]"
    >
      {/* Lumière douce en haut à droite : profondeur sans motif décoratif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_85%_10%,rgb(var(--ubb-brand-700)/0.9),transparent_70%)]"
      />

      <Container className="relative grid items-center gap-12 pb-16 pt-10 sm:pb-20 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20">
        <div>
          <motion.h1
            id="hero-title"
            {...enter(0)}
            className="ubb-heading max-w-[16ch] text-ubb-display text-white"
          >
            {t('landing.hero.title')}
          </motion.h1>

          <motion.p
            {...enter(0.1)}
            className="mt-5 max-w-ubb-prose font-text text-ubb-lead text-ubb-brand-200"
          >
            {t('landing.hero.subtitle')}
          </motion.p>

          <motion.div
            {...enter(0.2)}
            className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6"
          >
            <Button
              to="/diagnostic"
              size="lg"
              className="sm:whitespace-nowrap focus-visible:ring-ubb-accent-500 focus-visible:ring-offset-ubb-brand-900"
            >
              {t('landing.hero.cta')}
            </Button>
            <a
              href="#services"
              className="ubb-focus inline-flex min-h-[44px] items-center justify-center rounded font-text font-semibold text-white sm:whitespace-nowrap underline decoration-ubb-accent-500 decoration-2 underline-offset-[6px] hover:decoration-white focus-visible:ring-ubb-accent-500 focus-visible:ring-offset-ubb-brand-900"
            >
              {t('landing.hero.ctaSecondary')}
            </a>
          </motion.div>

          <motion.ul
            {...enter(0.3)}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-text text-sm text-ubb-brand-100"
          >
            {REASSURANCE_KEYS.map((key) => (
              <li key={key} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-ubb-accent-500" strokeWidth={3} aria-hidden="true" />
                {t(`landing.hero.reassurance.${key}`)}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Photo + carte score qui la chevauche */}
        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.6, delay: 0.15 },
              })}
          className="relative pb-10 sm:pb-12 lg:pb-0"
        >
          <img
            src={heroImage}
            srcSet={`${heroImageSmall} 640w, ${heroImage} 1000w`}
            sizes="(min-width: 1024px) 520px, 100vw"
            width="1000"
            height="667"
            alt={t('landing.hero.imageAlt')}
            fetchpriority="high"
            className="aspect-[4/3] w-full rounded-ubb-panel md:aspect-[16/9] lg:aspect-[4/3] object-cover object-[30%_center] shadow-ubb-lg"
          />
          <HeroScoreCard className="absolute -bottom-2 left-4 right-4 sm:left-6 sm:right-auto sm:w-80 lg:-bottom-8 lg:-left-10" />
        </motion.div>
      </Container>
    </section>
  )
}

export default Hero
