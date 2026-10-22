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

/** Inscription : une pousse dont les 5 feuilles (les 5 piliers) apparaissent une à une. */
export const RegisterScene = () => {
  const reduce = useReducedMotion()
  const float = useFloat(7, 5)
  const sway = reduce ? {} : { animate: { rotate: [-1.5, 1.5, -1.5] }, transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }
  // Feuilles : [x, y, rotation, couleur, côté]
  const leaves = [
    [212, 300, -40, C.greenMid],
    [268, 275, 40, C.green],
    [210, 235, -40, C.green],
    [270, 205, 40, C.greenMid],
    [240, 160, 0, C.yellow],
  ]
  return (
    <Frame label="register">
      <motion.circle cx="360" cy="110" r="38" fill={C.yellow} {...float} />
      <motion.g {...float}>
        <Pentagon cx={104} cy={120} r={34} done={2} />
      </motion.g>

      <motion.g {...sway} style={{ transformOrigin: '240px 340px' }}>
        <motion.path
          d="M240 340 C 240 290, 238 230, 240 170"
          fill="none"
          stroke={C.greenDark}
          strokeWidth="9"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {leaves.map(([x, y, rot, fill], i) => (
          <motion.ellipse
            key={i}
            cx={x}
            cy={y}
            rx="34"
            ry="15"
            fill={fill}
            transform={`rotate(${rot} ${x} ${y})`}
            style={{ transformOrigin: `${x}px ${y}px` }}
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 + i * 0.25, ease: 'easeOut' }}
          />
        ))}
      </motion.g>

      {/* Pot */}
      <path d="M180 338 h120 l-14 62 a10 10 0 0 1 -10 8 h-72 a10 10 0 0 1 -10 -8 z" fill={C.white} />
      <rect x="172" y="326" width="136" height="20" rx="10" fill={C.mist2} />
      <rect x="205" y="368" width="70" height="8" rx="4" fill={C.yellow} />
    </Frame>
  )
}

/** Mot de passe : un cadenas et sa clé. */
export const RecoveryScene = () => {
  const reduce = useReducedMotion()
  const float = useFloat(8, 4.5)
  const float2 = useFloat(6, 5.5, 0.8)
  return (
    <Frame label="recovery">
      <motion.g {...useReveal(0)}>
        {/* Anse */}
        <motion.path
          d="M190 215 v-45 a50 50 0 0 1 100 0 v45"
          fill="none"
          stroke={C.white}
          strokeWidth="22"
          strokeLinecap="round"
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        {/* Corps */}
        <rect x="150" y="205" width="180" height="150" rx="30" fill={C.white} />
        <rect x="150" y="205" width="180" height="44" rx="30" fill={C.mist} />
        <rect x="150" y="226" width="180" height="23" fill={C.mist} />
        <circle cx="240" cy="290" r="19" fill={C.yellow} />
        <rect x="233" y="296" width="14" height="36" rx="7" fill={C.yellow} />
      </motion.g>

      <motion.g {...float}>
        <g transform="translate(350 120) rotate(30)">
          <circle cx="0" cy="0" r="22" fill="none" stroke={C.yellow} strokeWidth="10" />
          <rect x="18" y="-5" width="70" height="10" rx="5" fill={C.yellow} />
          <rect x="62" y="5" width="9" height="16" rx="3" fill={C.yellow} />
          <rect x="78" y="5" width="9" height="12" rx="3" fill={C.yellow} />
        </g>
      </motion.g>

      <motion.g {...float2}>
        <Pentagon cx={96} cy={120} r={36} done={4} />
      </motion.g>
      <circle cx="400" cy="320" r="7" fill={C.yellowSoft} />
      <circle cx="84" cy="300" r="5" fill={C.yellowSoft} opacity="0.7" />
    </Frame>
  )
}

/** Équipe : 5 personnes reliées autour du pentagone. */
export const TeamScene = () => {
  const reduce = useReducedMotion()
  const float = useFloat(5, 5)
  const spots = pentagonVertices(138, 0).map(([x, y]) => [240 + x, 215 + y])
  const tones = [C.yellow, C.greenMid, C.yellowSoft, C.green, C.yellow]
  return (
    <Frame label="team">
      {spots.map(([x, y], i) => (
        <motion.line
          key={`l${i}`}
          x1="240"
          y1="215"
          x2={x}
          y2={y}
          stroke={C.mist2}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="2 10"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.12 }}
        />
      ))}
      <motion.g {...float}>
        <Pentagon cx={240} cy={215} r={52} done={5} />
      </motion.g>
      {spots.map(([x, y], i) => (
        <motion.g
          key={i}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        >
          <circle cx={x} cy={y} r="32" fill={C.white} />
          <circle cx={x} cy={y - 6} r="10" fill={tones[i]} />
          <path d={`M ${x - 18} ${y + 22} a 18 15 0 0 1 36 0 z`} fill={tones[i]} />
        </motion.g>
      ))}
    </Frame>
  )
}

export const SCENES = {
  login: LoginScene,
  register: RegisterScene,
  recovery: RecoveryScene,
  team: TeamScene,
}
