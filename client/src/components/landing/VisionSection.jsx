import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ClipboardCheck, Target, ShieldCheck } from 'lucide-react'
import { Section, Container, SectionHeading } from '../ui/ds'
import { LEVELS_V2 } from '../../utils/colors'

const BENEFITS = [
  { key: 'method', icon: ClipboardCheck },
  { key: 'priorities', icon: Target },
  { key: 'privacy', icon: ShieldCheck },
]

const VisionSection = () => {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language || 'fr').slice(0, 2)

  return (
    <Section id="vision" tone="navy" aria-labelledby="vision-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              id="vision-title"
              tone="dark"
              title={t('landing.vision.title')}
              intro={t('landing.vision.intro')}
            />

            <ul className="mt-10 space-y-7">
              {BENEFITS.map(({ key, icon: Icon }) => (
                <li key={key} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ubb-field bg-white/10 text-ubb-gold-500">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-white">
                      {t(`landing.vision.benefits.${key}.title`)}
                    </h3>
                    <p className="mt-1 max-w-ubb-prose font-text text-ubb-body text-ubb-navy-200">
                      {t(`landing.vision.benefits.${key}.description`)}
                      {key === 'privacy' && (
                        <>
                          {' '}
                          <Link
                            to="/privacy"
                            className="ubb-focus rounded font-semibold text-white underline decoration-ubb-gold-500 underline-offset-4 hover:decoration-white focus-visible:ring-offset-ubb-navy-900"
                          >
                            {t('landing.vision.benefits.privacy.link')}
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Échelle des 5 niveaux de maturité (mêmes paliers que le calcul du score) */}
          <div className="self-start rounded-ubb-panel border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <h3 className="font-heading text-ubb-subtitle text-white">
              {t('landing.vision.levels.title')}
            </h3>
            <p className="mt-2 font-text text-ubb-small text-ubb-navy-200">
              {t('landing.vision.levels.intro')}
            </p>

            <ol className="mt-6 divide-y divide-white/10">
              {LEVELS_V2.map((level, index) => (
                <li key={level.id} className="flex items-center gap-4 py-3.5">
                  <span className="w-5 shrink-0 font-heading text-sm font-semibold text-ubb-navy-300">
                    {index + 1}
                  </span>
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: level.color }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 font-text font-semibold text-white">
                    {level.label[lang] || level.label.fr}
                  </span>
                  <span className="font-text text-sm tabular-nums text-ubb-navy-200">
                    {t('landing.vision.levels.range', { min: level.min, max: level.max })}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Signature UBB */}
        <figure className="mt-16 border-t border-white/10 pt-10 lg:mt-20">
          <blockquote className="max-w-3xl font-heading text-ubb-subtitle font-medium text-white">
            {t('landing.vision.signature.quote')}
          </blockquote>
          <figcaption className="mt-4 font-text text-ubb-body text-ubb-navy-200">
            {t('landing.vision.signature.author')}
          </figcaption>
        </figure>
      </Container>
    </Section>
  )
}

export default VisionSection
