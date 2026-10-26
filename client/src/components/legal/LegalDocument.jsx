import React from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, List } from 'lucide-react'
import { Section, Container } from '../ui/ds'

// Clés qui ne sont pas des sections du document
const META_KEYS = ['title', 'lastUpdated', 'seoDescription']

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value)
const listOf = (obj) => Object.values(obj).filter((v) => typeof v === 'string')

const BulletList = ({ items }) => (
  <ul className="mt-3 list-disc space-y-2 pl-5 font-text text-ubb-body text-ubb-ink marker:text-ubb-brand-900">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
)

/** Contenu d'un bloc : paragraphe, listes de chaînes, sous-blocs (avec leur propre titre). */
const Body = ({ block }) => {
  const entries = Object.entries(block).filter(([key]) => key !== 'title' && key !== 'content')
  return (
    <>
      {typeof block.content === 'string' && (
        <p className="mt-3 font-text text-ubb-body leading-relaxed text-ubb-ink">{block.content}</p>
      )}
      {entries.map(([key, value]) => {
        if (!isObject(value)) return null
        if (typeof value.title === 'string') {
          return (
            <div key={key} className="mt-5">
              <h3 className="font-heading text-lg font-semibold text-ubb-ink">{value.title}</h3>
              <Body block={value} />
            </div>
          )
        }
        return <BulletList key={key} items={listOf(value)} />
      })}
    </>
  )
}

/**
 * Document juridique (confidentialité, conditions d'utilisation) lu directement dans les textes
 * i18n : chaque clé de premier niveau (hors titre et date) devient une section numérotée,
 * avec un sommaire cliquable. Le contenu juridique n'est pas dupliqué ici.
 *
 * - `ns` : clé i18n du document ("privacy" | "terms")
 * - `icon` : icône d'en-tête
 * - `showCompany` : affiche la raison sociale et les mentions légales dans la section contact
 */
const LegalDocument = ({ ns, icon: Icon, showCompany = false }) => {
  const { t, i18n } = useTranslation()
  const doc = t(ns, { returnObjects: true })
  const sections = Object.entries(doc).filter(([key, value]) => !META_KEYS.includes(key) && isObject(value))
  const lang = (i18n.language || 'fr').slice(0, 2)
  const date = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const TocList = ({ className = '' }) => (
    <ol className={`space-y-0.5 px-2 pb-3 pt-1 lg:px-0 lg:pb-0 ${className}`}>
      {sections.map(([key, section], index) => (
        <li key={key}>
          <a
            href={`#${ns}-${key}`}
            className="ubb-focus flex min-h-[44px] items-center gap-3 rounded-ubb-chip px-2 font-text text-sm text-ubb-ink-muted hover:bg-white hover:text-ubb-ink"
          >
            <span className="w-5 shrink-0 font-heading text-xs font-semibold text-ubb-brand-900">{index + 1}</span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <Section tone="soft" aria-labelledby="legal-title" className="!pt-10 sm:!pt-14">
      <Container className="max-w-5xl">
        <header className="max-w-3xl">
          <span className="flex h-12 w-12 items-center justify-center rounded-ubb-field bg-ubb-brand-900 text-white">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 id="legal-title" className="ubb-heading mt-5 text-ubb-title sm:text-ubb-display">
            {doc.title}
          </h1>
          <p className="mt-3 font-text text-ubb-body text-ubb-ink-muted">
            {doc.lastUpdated} : {date}
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-12">
          {/* Sommaire : replié sur mobile, toujours visible à côté du texte sur grand écran */}
          <nav aria-label={t('legal.tocLabel')} className="lg:sticky lg:top-[calc(var(--ubb-header-h)+1.5rem)] lg:self-start">
            <details className="rounded-ubb-card border border-ubb-brand-900/10 bg-white lg:hidden">
              <summary className="ubb-focus flex min-h-[48px] cursor-pointer list-none items-center gap-2 rounded-ubb-card px-4 font-text text-sm font-semibold text-ubb-ink">
                <List className="h-4 w-4" aria-hidden="true" />
                {t('legal.toc')}
              </summary>
              <TocList />
            </details>
            <div className="hidden lg:block">
              <p className="font-text text-sm font-semibold text-ubb-ink-muted">{t('legal.toc')}</p>
              <TocList className="pt-3" />
            </div>
          </nav>

          <article className="ubb-card min-w-0 p-6 sm:p-10">
            {sections.map(([key, section], index) => (
              <section
                key={key}
                id={`${ns}-${key}`}
                aria-labelledby={`${ns}-${key}-title`}
                className="scroll-mt-[calc(var(--ubb-header-h)+1rem)] border-t border-ubb-brand-900/[0.08] py-7 first:border-t-0 first:pt-0 last:pb-0"
              >
                <h2 id={`${ns}-${key}-title`} className="flex gap-3 font-heading text-xl font-semibold text-ubb-ink sm:text-2xl">
                  <span className="text-ubb-brand-900" aria-hidden="true">{index + 1}.</span>
                  <span className="min-w-0">{section.title}</span>
                </h2>
                <Body block={section} />

                {key === 'contact' && (
                  <div className="mt-5 rounded-ubb-field bg-ubb-paper-soft p-5">
                    {showCompany && (
                      <>
                        <p className="font-text font-semibold text-ubb-ink">{t('company.name')}</p>
                        <p className="mt-1 font-text text-ubb-small text-ubb-ink-muted">
                          {t('company.address')} / {t('company.rccm')} / {t('company.ninea')}
                        </p>
                      </>
                    )}
                    <ul className={showCompany ? 'mt-3' : ''}>
                      <li>
                        <a href="mailto:info@checkmyenterprise.com" className="ubb-focus inline-flex min-h-[44px] items-center gap-3 rounded font-text text-ubb-body font-medium text-ubb-ink underline decoration-ubb-accent-500 decoration-2 underline-offset-4">
                          <Mail className="h-5 w-5 text-ubb-brand-900" aria-hidden="true" />
                          info@checkmyenterprise.com
                        </a>
                      </li>
                      <li>
                        <a href="tel:+221788346969" className="ubb-focus inline-flex min-h-[44px] items-center gap-3 rounded font-text text-ubb-body font-medium text-ubb-ink underline decoration-ubb-accent-500 decoration-2 underline-offset-4">
                          <Phone className="h-5 w-5 text-ubb-brand-900" aria-hidden="true" />
                          +221 78 834 69 69
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </article>
        </div>
      </Container>
    </Section>
  )
}

export default LegalDocument
