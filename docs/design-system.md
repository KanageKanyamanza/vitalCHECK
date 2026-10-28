# Design system UBB — VitalCHECK

Référence pour toutes les phases de la refonte. Direction : **« Mix UBB »** — rigueur corporate (sections nettes, hiérarchie claire) + chaleur (photos humaines, arrondis, respirations).

## Où sont les valeurs

| Fichier | Rôle |
|---|---|
| `client/src/styles/tokens.css` | **Source unique** : variables CSS (couleurs en canaux RGB, polices, rayons, ombres) |
| `client/tailwind.config.js` | Expose les tokens sous le préfixe `ubb` (`bg-ubb-brand-900`, `text-ubb-title`, `rounded-ubb-card`…) |
| `client/src/index.css` | Classes de composants `.ubb-*` (boutons, cartes, champs, sections) |
| `client/src/utils/colors.js` | Export `ubb` : mêmes valeurs en hex pour les graphiques et PDF |
| `client/src/components/ui/ds/` | Composants React : `Button`, `Card`, `Section`, `Container`, `SectionHeading` |

L'ancienne palette (`primary-*`, `accent-*`, `vitalCHECK-*`) reste en place pour les écrans non migrés. Chaque phase migre ses écrans vers `ubb-*` ; ne pas modifier `primary` globalement.

## Couleurs

Ce sont les couleurs vitalCHECK du projet : le vert `#00751B` et le jaune `#F4C542` (déjà définis dans `tailwind.config.js`).

| Token Tailwind | Hex | Usage |
|---|---|---|
| `ubb-brand-900` (`ubb-brand`) | `#00751B` | Vert vitalCHECK : fonds forts (hero, vision), bouton secondaire, focus |
| `ubb-brand-950` | `#004A12` | Vert profond : pied de page, texte sur fond jaune |
| `ubb-brand-800` | `#1A8A33` | Survol sur vert |
| `ubb-brand-200` | `#DCF0E0` | Texte clair sur fond vert |
| `ubb-brand-100` (`ubb-mist`) | `#EAF6EC` | Sections de respiration |
| `ubb-accent-500` (`ubb-accent`) | `#F4C542` | Jaune vitalCHECK : fond du CTA principal, icônes sur vert |
| `ubb-accent-600` | `#E5B22A` | Survol du CTA |
| `ubb-accent-ink` | `#8A6300` | Jaune foncé **en texte** sur fond clair |
| `ubb-ink` | `#0F2416` | Texte principal |
| `ubb-ink-muted` | `#4A5D50` | Texte secondaire |

### Règles de contraste (WCAG AA)

- Blanc sur vert `#00751B` : 5.9:1 · `brand-200` sur vert : 5:1 · `ink-muted` sur blanc : 7.1:1.
- CTA jaune : texte `brand-950` sur `#F4C542` = 6.5:1.
- **Jaune `#F4C542` sur blanc : 1.6:1 → interdit pour du texte.** Utiliser `text-ubb-accent-ink`.
- **Jamais de texte blanc sur fond jaune.**
- Jaune sur vert : 3.6:1 → réservé aux icônes et éléments graphiques, pas au texte courant.
- Anneau de focus : vert sur fond clair ; jaune sur fond vert (`focus-visible:ring-ubb-accent-500`).

## Typographie

- **Bricolage Grotesque** (`font-heading`) — titres. Grotesque chaleureuse à axe optique.
- **Figtree** (`font-text`) — texte courant et interface.
- Échelle fluide (360 → 1280 px) : `text-ubb-display`, `text-ubb-title`, `text-ubb-subtitle`, `text-ubb-lead`, `text-ubb-body`, `text-ubb-small`.
- Longueur de ligne ≤ 68 caractères : `max-w-ubb-prose`.
- Phrases en casse normale ; pas de labels en capitales, pas de mot isolé coloré dans un titre.

## Composants

```jsx
import { Button, Card, Section, Container, SectionHeading } from '../components/ui'

<Section tone="mist" id="services">          {/* white | soft | mist | navy */}
  <Container>
    <SectionHeading title={t('…')} intro={t('…')} />
    <Card padding="lg">…</Card>
    <Button to="/diagnostic" size="lg">{t('…')}</Button>   {/* primary | secondary | outline | onDark */}
  </Container>
</Section>
```

- Boutons : pilule, hauteur ≥ 48 px (44 px en `sm`) → cible tactile conforme.
- Rayons hiérarchisés : puce 8 px < champ 12 px < carte 20 px < panneau 28 px.
- Ombres teintées navy (`shadow-ubb-sm|md|lg`) — pas de gris neutre.
- Focus clavier : anneau or visible (`.ubb-focus`, inclus dans boutons et champs).

## Principes

1. **Un seul élément signature par écran.** Sur la landing : le pentagone des 5 niveaux de maturité. Le reste reste sobre.
2. **Mouvement rare** : une séquence orchestrée au chargement, pas d'apparition au scroll sur chaque carte. Respecter `prefers-reduced-motion`.
3. **Mobile d'abord** : concevoir à 360 px, enrichir ensuite.
4. **Tous les textes via i18n** (`fr.json` + `en.json`).
5. **Discours** : « méthodologie d'audit UBB », « analyse experte », « diagnostic professionnel », « recommandations personnalisées ». Aucune mention d'IA côté client.
