import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { pentagonVertices } from '../ui/ds/Pentagon'

/**
 * Illustrations vitalCHECK : dessins vectoriels animés, aux couleurs de la marque,
 * construits autour du pentagone des 5 piliers. Elles sont décoratives (aria-hidden) :
 * le sens de la page est porté par le texte qui les accompagne.
 * Mouvement lent et discret ; arrêté si l'utilisateur préfère moins de mouvement.
 */

const C = {
  white: '#FFFFFF',
  paper: '#F8FAF8',
  mist: '#EAF6EC',
  mist2: '#DCF0E0',
  green: '#00751B',
  greenMid: '#2E9A45',
  greenDark: '#004A12',
  yellow: '#F4C542',
  yellowSoft: '#F8D97A',
  yellowPale: '#FDF0C4',
}

// Pentagone dessiné à (cx, cy) ; `done` segments en jaune, le reste en vert clair
const Pentagon = ({ cx, cy, r, done = 5, rotate = 0 }) => {
  const v = pentagonVertices(r, 0)
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      {v.map(([x, y], i) => {
        const [nx, ny] = v[(i + 1) % 5]
        return (
          <polygon
            key={i}
            points={`0,0 ${x.toFixed(1)},${y.toFixed(1)} ${nx.toFixed(1)},${ny.toFixed(1)}`}
            fill={i < done ? C.yellow : C.mist}
            stroke={C.white}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        )
      })}
    </g>
  )
}

// Flottement lent ; immobile si le mouvement est réduit
const useFloat = (distance = 8, duration = 5, delay = 0) => {
  const reduce = useReducedMotion()
  return reduce
    ? {}
    : {
        animate: { y: [0, -distance, 0] },
        transition: { duration, delay, repeat: Infinity, ease: 'easeInOut' },
      }
}

// Apparition une seule fois, à l'arrivée sur la page
const useReveal = (delay = 0) => {
  const reduce = useReducedMotion()
  return reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay, ease: 'easeOut' },
      }
}

const Backdrop = () => (
  <g>
    <circle cx="240" cy="230" r="190" fill={C.greenMid} opacity="0.18" />
    <circle cx="240" cy="230" r="130" fill={C.greenMid} opacity="0.18" />
  </g>
)

const Frame = ({ children, label }) => (
  <svg viewBox="0 0 480 440" className="h-auto w-full" aria-hidden="true" focusable="false" data-scene={label}>
    <Backdrop />
    {children}
  </svg>
)

/** Connexion : un tableau de bord avec un score qui monte et les 5 piliers. */
export const LoginScene = () => {
  const reduce = useReducedMotion()
  const float = useFloat(7, 5.5)
  const float2 = useFloat(6, 4.5, 1)
  const bars = [0.55, 0.8, 0.45, 0.9, 0.65]
  const circumference = 2 * Math.PI * 46
  return (
    <Frame label="login">
      <motion.g {...useReveal(0)}>
        <rect x="70" y="100" width="340" height="250" rx="26" fill={C.white} />
        <rect x="70" y="100" width="340" height="46" rx="26" fill={C.mist} />
        <rect x="70" y="124" width="340" height="22" fill={C.mist} />
        <circle cx="100" cy="123" r="6" fill={C.yellow} />
        <circle cx="120" cy="123" r="6" fill={C.greenMid} opacity="0.5" />
        <circle cx="140" cy="123" r="6" fill={C.greenMid} opacity="0.25" />

        {/* Jauge de score */}
        <circle cx="160" cy="235" r="46" fill="none" stroke={C.mist2} strokeWidth="14" />
        <motion.circle
          cx="160"
          cy="235"
          r="46"
          fill="none"
          stroke={C.yellow}
          strokeWidth="14"
          strokeLinecap="round"
          transform="rotate(-90 160 235)"
          strokeDasharray={circumference}
          initial={reduce ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * 0.28 }}
          transition={{ duration: 1.4, delay: 0.5, ease: 'easeOut' }}
        />
        <text x="160" y="244" textAnchor="middle" fontSize="28" fontWeight="700" fill={C.greenDark} fontFamily="Bricolage Grotesque, sans-serif">
          72
        </text>

        {/* Les 5 piliers */}
        {bars.map((h, i) => (
          <motion.rect
            key={i}
            x={246 + i * 28}
            y={310 - h * 110}
            width="18"
            height={h * 110}
            rx="6"
            fill={i === 3 ? C.yellow : C.green}
            style={{ transformOrigin: `${255 + i * 28}px 310px` }}
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.7, delay: 0.7 + i * 0.12, ease: 'easeOut' }}
          />
        ))}
        <line x1="236" y1="310" x2="394" y2="310" stroke={C.mist2} strokeWidth="3" strokeLinecap="round" />
      </motion.g>

      <motion.g {...float}>
        <Pentagon cx={392} cy={86} r={44} done={3} />
      </motion.g>

      <motion.g {...float2}>
        <circle cx="86" cy="344" r="28" fill={C.yellow} />
        <path d="M74 344 l9 9 l17 -19" fill="none" stroke={C.greenDark} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </Frame>
  )
}

export const SCENES = {
  login: LoginScene,
}
