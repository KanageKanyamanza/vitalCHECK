import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, LayoutGrid, LineChart, UserCheck } from 'lucide-react'
import { Button, Section, Container, SectionHeading } from '../ui/ds'

const FREE_POINTS = ['score', 'level', 'recommendations']

// Offres complémentaires, de la plus légère à la plus accompagnée
const OFFERS = [
  { key: 'sectors', icon: LayoutGrid, href: '#secteurs' },
  { key: 'followUp', icon: LineChart, to: '/pricing' },
  { key: 'expert', icon: UserCheck, to: '/pricing' },
]

const offerLinkClass =
  'ubb-focus mt-3 inline-flex min-h-[44px] items-center rounded font-text font-semibold text-ubb-ink underline decoration-ubb-gold-500 decoration-2 underline-offset-[6px] hover:decoration-ubb-ink'

const ServicesSection = () => {
  const { t } = useTranslation()

  return (
    <Section id="services" tone="white" aria-labelledby="services-title">
      <Container>
        <SectionHeading
          id="services-title"
          title={t('landing.services.title')}
          intro={t('landing.services.intro')}
        />

        <div className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          {/* Offre principale : le diagnostic gratuit */}
          <article className="flex flex-col justify-center rounded-ubb-panel border border-ubb-gold-100 bg-ubb-gold-50 p-6 sm:p-10">
            <h3 className="ubb-heading text-ubb-title">{t('landing.services.free.title')}</h3>
            <p className="mt-4 max-w-ubb-prose font-text text-ubb-lead text-ubb-ink-muted">
              {t('landing.services.free.description')}
            </p>

            <ul className="mt-8 space-y-4 font-text text-ubb-lead text-ubb-ink">
              {FREE_POINTS.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ubb-navy-900">
                    <Check className="h-3.5 w-3.5 text-ubb-gold-500" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {t(`landing.services.free.points.${point}`)}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-stretch gap-3 sm:items-start">
              <Button to="/diagnostic" size="lg" className="sm:whitespace-nowrap focus-visible:ring-offset-ubb-gold-50">
                {t('landing.services.free.cta')}
              </Button>
              <p className="text-center font-text text-ubb-small text-ubb-ink-muted sm:pl-8 sm:text-left">
                {t('landing.services.free.meta')}
              </p>
            </div>
          </article>

          {/* Offres complémentaires */}
          <ul className="flex flex-col gap-4">
            {OFFERS.map(({ key, icon: Icon, href, to }) => (
              <li key={key} className="ubb-card flex flex-1 gap-4 p-5 sm:gap-5 sm:p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-ubb-field bg-ubb-mist text-ubb-navy-900">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="ubb-heading text-lg font-semibold">
                    {t(`landing.services.${key}.title`)}
                  </h3>
                  <p className="mt-1.5 font-text text-ubb-body text-ubb-ink-muted">
                    {t(`landing.services.${key}.description`)}
                  </p>
                  {to ? (
                    <Link to={to} className={offerLinkClass}>
                      {t(`landing.services.${key}.link`)}
                    </Link>
                  ) : (
                    <a href={href} className={offerLinkClass}>
                      {t(`landing.services.${key}.link`)}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}

export default ServicesSection
