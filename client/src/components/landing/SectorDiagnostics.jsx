import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Section, Container, SectionHeading } from '../ui/ds'

// Textes des cartes : landing.sectorCards.items.<questionnaire> (fr.json / en.json)
const SECTORS = [
  {
    questionnaire: 'agriculture',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=640&q=75',
  },
  {
    questionnaire: 'retail',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=640&q=75',
  },
  {
    questionnaire: 'restaurant',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=640&q=75',
  },
  {
    questionnaire: 'construction',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=640&q=75',
  },
  {
    questionnaire: 'distribution',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=640&q=75',
  },
  {
    questionnaire: 'export',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=640&q=75',
  },
  {
    questionnaire: 'manufacturing',
    image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=640&q=75',
  },
]

/**
 * Diagnostics sectoriels : défilement horizontal sur mobile, grille sur desktop.
 * Les routes /diagnostic?questionnaire=<secteur> sont inchangées.
 */
const SectorDiagnostics = () => {
  const { t } = useTranslation()

  return (
    <Section id="secteurs" tone="mist" aria-labelledby="sectors-title">
      <Container>
        <SectionHeading
          id="sectors-title"
          title={t('landing.sectorCards.title')}
          intro={t('landing.sectorCards.intro')}
        />
      </Container>

      <Container className="mt-10 !px-0 sm:!px-6 lg:!px-8">
        <ul className="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:scroll-px-0 sm:px-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
          {SECTORS.map(({ questionnaire, image }) => {
            const key = `landing.sectorCards.items.${questionnaire}`
            return (
              <li
                key={questionnaire}
                className="ubb-card flex w-[82%] shrink-0 snap-start flex-col overflow-hidden sm:w-[45%] lg:w-auto"
              >
                <img
                  src={image}
                  alt={t(`${key}.imageAlt`)}
                  width="640"
                  height="360"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/9] w-full bg-ubb-brand-100 object-cover"
                />
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-text text-ubb-small font-semibold text-ubb-accent-ink">
                    {t(`${key}.name`)}
                  </p>
                  <h3 className="ubb-heading mt-1 text-lg font-semibold leading-snug">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="mt-2 flex-1 font-text text-ubb-small text-ubb-ink-muted">
                    {t(`${key}.description`)}
                  </p>
                  <Button
                    to={`/diagnostic?questionnaire=${questionnaire}`}
                    variant="secondary"
                    size="sm"
                    className="mt-5 w-full"
                    aria-label={`${t('landing.sectorCards.button')} : ${t(`${key}.title`)}`}
                  >
                    {t('landing.sectorCards.button')}
                  </Button>
                </div>
              </li>
            )
          })}

          {/* Toute autre activité : diagnostic général */}
          <li className="flex w-[82%] shrink-0 snap-start flex-col justify-between rounded-ubb-card border-2 border-dashed border-ubb-brand-900/15 p-5 sm:w-[45%] lg:w-auto">
            <div>
              <h3 className="ubb-heading text-lg font-semibold leading-snug">
                {t('landing.sectorCards.other.title')}
              </h3>
              <p className="mt-2 font-text text-ubb-small text-ubb-ink-muted">
                {t('landing.sectorCards.other.description')}
              </p>
            </div>
            <Button to="/diagnostic" variant="outline" size="sm" className="mt-5 w-full">
              {t('landing.sectorCards.other.button')}
            </Button>
          </li>
        </ul>
      </Container>
    </Section>
  )
}

export default SectorDiagnostics
