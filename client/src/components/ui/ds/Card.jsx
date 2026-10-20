import React from 'react'

const PADDINGS = {
  none: '',
  md: 'p-6',
  lg: 'p-6 sm:p-8',
}

/** Carte du design system UBB : fond blanc, rayon carte, ombre teintée navy. */
const Card = ({ as: Tag = 'div', padding = 'md', className = '', children, ...props }) => (
  <Tag className={`ubb-card ${PADDINGS[padding]} ${className}`} {...props}>
    {children}
  </Tag>
)

export default Card
