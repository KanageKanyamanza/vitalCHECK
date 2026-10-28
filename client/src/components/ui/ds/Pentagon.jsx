import React from 'react'

/**
 * Pentagone : motif signature de vitalCHECK.
 * - landing : 5 anneaux concentriques = 5 niveaux de maturité (HeroScoreCard)
 * - parcours : 5 segments = 5 piliers du diagnostic (PentagonSegments)
 */
export const PENTAGON_CENTER = 60

// Sommets d'un pentagone régulier de rayon `radius`, pointe en haut (viewBox 0 0 120 120)
export const pentagonVertices = (radius, center = PENTAGON_CENTER) =>
  Array.from({ length: 5 }, (_, i) => {
    const angle = (-90 + i * 72) * (Math.PI / 180)
    return [center + radius * Math.cos(angle), center + radius * Math.sin(angle)]
  })

export const pentagonPoints = (radius, center = PENTAGON_CENTER) =>
  pentagonVertices(radius, center)
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ')

// Couleurs du motif (valeurs des tokens ubb-accent / ubb-brand, en hex pour le SVG)
export const PENTAGON_COLORS = {
  done: '#F4C542', // accent-500
  current: '#F8D97A', // accent-300
  pending: '#EAF6EC', // brand-100
  stroke: '#FFFFFF',
}

/**
 * Pentagone découpé en 5 triangles (un par pilier), dans le sens horaire depuis la pointe.
 * `done` : nombre de piliers terminés ; `current` : index du pilier en cours (ou -1).
 */
export const PentagonSegments = ({ done = 0, current = -1, className = '', title, strokeWidth = 3 }) => {
  const vertices = pentagonVertices(54)
  const [cx, cy] = [PENTAGON_CENTER, PENTAGON_CENTER]

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
    >
      {vertices.map(([x, y], i) => {
        const [nx, ny] = vertices[(i + 1) % 5]
        const fill =
          i < done ? PENTAGON_COLORS.done : i === current ? PENTAGON_COLORS.current : PENTAGON_COLORS.pending
        return (
          <polygon
            key={i}
            points={`${cx},${cy} ${x.toFixed(2)},${y.toFixed(2)} ${nx.toFixed(2)},${ny.toFixed(2)}`}
            fill={fill}
            stroke={PENTAGON_COLORS.stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            style={{ transition: 'fill 300ms ease-out' }}
          />
        )
      })}
    </svg>
  )
}
