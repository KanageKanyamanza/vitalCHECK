import React from 'react'
import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'ubb-btn-primary',
  secondary: 'ubb-btn-secondary',
  outline: 'ubb-btn-outline',
  onDark: 'ubb-btn-on-dark',
}

const SIZES = {
  sm: 'ubb-btn-sm',
  md: '',
  lg: 'ubb-btn-lg',
}

/**
 * Bouton du design system UBB.
 * - `to` : lien interne (react-router)
 * - `href` : lien externe ou ancre
 * - sinon : <button>
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  className = '',
  children,
  ...props
}) => {
  const classes = ['ubb-btn', VARIANTS[variant], SIZES[size], className]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
