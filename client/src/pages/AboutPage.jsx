import React from 'react'
import { useTranslation } from 'react-i18next'
import { Target, Eye, ShieldCheck, Star, Flame, Users, Wrench, ClipboardCheck, TrendingUp, Code2, Check } from 'lucide-react'
import { SocialShare } from '../components/ui'
import { Button, Section, Container, SectionHeading } from '../components/ui/ds'
import SEOHead from '../components/seo/SEOHead'
import { SCENES } from '../components/illustrations/scenes'

const VALUES = [
  { key: 'integrity', icon: ShieldCheck },
  { key: 'excellence', icon: Star },
  { key: 'courage', icon: Flame },
  { key: 'solidarity', icon: Users },
  { key: 'pragmatism', icon: Wrench },
]

const SERVICES = [
  { key: 'healthCheck', icon: ClipboardCheck },
  { key: 'visibility', icon: TrendingUp },
  { key: 'development', icon: Code2 },
]

const IMPACTS = ['stabilized', 'export', 'digital']

const AboutPage = () => {
  const { t } = useTranslation()
  const Scene = SCENES.team

  return (
    <div className="bg-white">
      <SEOHead
        title={t('about.seo.title')}
        description={t('about.seo.description')}
        url="/about"
      />

      {/* En-tête */}
      <section
        aria-labelledby="about-title"
        className="relative overflow-hidden rounded-b-[2rem] bg-ubb-brand-900 text-white sm:rounded-b-[3rem]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_85%_10%,rgb(var(--ubb-brand-700)/0.9),transparent_70%)]"
        />
        <Container className="relative grid items-center gap-8 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <div>
            <h1 id="about-title" className="ubb-heading text-ubb-display text-white">
              {t('about.title')}
            </h1>
            <p className="mt-5 max-w-ubb-prose font-text text-ubb-lead text-ubb-brand-200">{t('about.subtitle')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/diagnostic" size="lg" className="focus-visible:ring-ubb-accent-500 focus-visible:ring-offset-ubb-brand-900">
                {t('about.cta.startAssessment')}
              </Button>
              <Button to="/contact" size="lg" variant="onDark" className="focus-visible:ring-ubb-accent-500 focus-visible:ring-offset-ubb-brand-900">
                {t('about.cta.contactUs')}
              </Button>
            </div>
          </div>
          <div className="mx-auto hidden w-full max-w-[420px] lg:block">{Scene && <Scene />}</div>
        </Container>
      </section>

      {/* Mission et vision */}
      <Section tone="white" aria-label={`${t('about.mission.title')} / ${t('about.vision.title')}`}>
        <Container>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {[
              { key: 'mission', icon: Target, tone: 'bg-ubb-brand-50 border-ubb-brand-900/10' },
              { key: 'vision', icon: Eye, tone: 'bg-ubb-accent-50 border-ubb-accent-100' },
            ].map(({ key, icon: Icon, tone }) => (
              <article key={key} className={`rounded-ubb-panel border p-6 sm:p-10 ${tone}`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-ubb-field bg-white text-ubb-brand-900">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="ubb-heading mt-5 text-ubb-title">{t(`about.${key}.title`)}</h2>
                <p className="mt-4 max-w-ubb-prose font-text text-ubb-lead text-ubb-ink-muted">{t(`about.${key}.content`)}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Valeurs */}
      <Section tone="mist" aria-labelledby="values-title">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--ubb-header-h)+2rem)] lg:self-start">
            <SectionHeading id="values-title" title={t('about.values.title')} intro={t('about.values.subtitle')} />
          </div>
          <ul className="divide-y divide-ubb-brand-900/10 rounded-ubb-panel bg-white shadow-ubb-sm">
            {VALUES.map(({ key, icon: Icon }) => (
              <li key={key} className="flex gap-4 p-5 sm:gap-5 sm:p-7">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ubb-field bg-ubb-mist text-ubb-brand-900">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="ubb-heading text-lg font-semibold">{t(`about.values.${key}.title`)}</h3>
                  <p className="mt-1 font-text text-ubb-body text-ubb-ink-muted">{t(`about.values.${key}.description`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Histoire */}
      <Section tone="brand" aria-labelledby="story-title">
        <Container className="max-w-4xl">
          <h2 id="story-title" className="ubb-heading text-ubb-title text-white">
            {t('about.story.title')}
          </h2>
          <p className="mt-5 max-w-ubb-prose font-text text-ubb-lead text-ubb-brand-100">{t('about.story.content1')}</p>

          <div className="mt-8 rounded-ubb-panel border border-white/15 bg-white/10 p-6 sm:p-8">
            <h3 className="font-heading text-xl font-semibold text-white">{t('about.story.example.title')}</h3>
            <p className="mt-3 font-text text-ubb-body text-ubb-brand-100">{t('about.story.example.content')}</p>
            <p className="mt-3 font-text text-ubb-body font-semibold text-white">{t('about.story.example.result')}</p>
          </div>

          <p className="mt-8 max-w-ubb-prose font-heading text-ubb-subtitle font-medium text-white">{t('about.story.content2')}</p>
        </Container>
      </Section>

      {/* Ce que nous faisons */}
      <Section id="what-we-do" tone="white" aria-labelledby="services-about-title">
        <Container>
          <SectionHeading id="services-about-title" title={t('about.services.title')} intro={t('about.services.subtitle')} />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {SERVICES.map(({ key, icon: Icon }) => (
              <li key={key} className="ubb-card p-6 sm:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-ubb-field bg-ubb-mist text-ubb-brand-900">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="ubb-heading mt-5 text-lg font-semibold">{t(`about.services.${key}.title`)}</h3>
                <p className="mt-2 font-text text-ubb-body text-ubb-ink-muted">{t(`about.services.${key}.description`)}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Impact */}
      <Section tone="soft" aria-labelledby="impact-title">
        <Container>
          <SectionHeading id="impact-title" title={t('about.impact.title')} />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {IMPACTS.map((key) => (
              <li key={key} className="flex gap-4 rounded-ubb-card border border-ubb-brand-900/10 bg-white p-5 sm:p-6">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ubb-brand-900 text-white">
                  <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                </span>
                <p className="font-text text-ubb-body font-medium text-ubb-ink">{t(`about.impact.${key}`)}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Appel final */}
      <Section tone="white" aria-labelledby="about-cta-title">
        <Container className="max-w-3xl text-center">
          <h2 id="about-cta-title" className="ubb-heading text-ubb-title">
            {t('about.cta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-ubb-prose font-text text-ubb-lead text-ubb-ink-muted">{t('about.cta.subtitle')}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Button to="/diagnostic" size="lg">
              {t('about.cta.startAssessment')}
            </Button>
            <Button to="/contact" size="lg" variant="outline">
              {t('about.cta.contactUs')}
            </Button>
          </div>
        </Container>
      </Section>

      <SocialShare title={t('about.seo.title')} description={t('about.seo.description')} />
    </div>
  )
}

export default AboutPage
