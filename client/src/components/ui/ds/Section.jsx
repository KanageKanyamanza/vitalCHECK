import React from 'react'

// Fonds de section : alterner clair / mist / vert donne le rythme de la page
const TONES = {
  white: 'bg-white text-ubb-ink',
  soft: 'bg-ubb-paper-soft text-ubb-ink',
  mist: 'bg-ubb-mist text-ubb-ink',
  brand: 'bg-ubb-brand-900 text-white',
}

export const Container = ({ as: Tag = 'div', className = '', children, ...props }) => (
  <Tag className={`ubb-container ${className}`} {...props}>
    {children}
  </Tag>
)

const Section = ({ as: Tag = 'section', tone = 'white', id, className = '', children, ...props }) => (
  <Tag id={id} className={`ubb-section ${TONES[tone]} ${className}`} {...props}>
    {children}
  </Tag>
)

/**
 * Titre de section : un titre et, en option, une introduction.
 * Aligné à gauche par défaut ; `align="center"` pour les sections de conclusion.
 */
export const SectionHeading = ({
  title,
  intro,
  as: Tag = 'h2',
  align = 'left',
  tone = 'light',
  id,
  className = '',
}) => {
  const isCenter = align === 'center'
  const onDark = tone === 'dark'

  return (
    <div className={`${isCenter ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <Tag
        id={id}
        className={`ubb-heading text-ubb-title ${onDark ? 'text-white' : ''}`}
      >
        {title}
      </Tag>
      {intro && (
        <p
          className={`mt-4 max-w-ubb-prose font-text text-ubb-lead ${isCenter ? 'mx-auto' : ''} ${
            onDark ? 'text-ubb-brand-200' : 'text-ubb-ink-muted'
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  )
}

export default Section
