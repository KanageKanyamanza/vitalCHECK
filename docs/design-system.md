# Design system UBB — VitalCHECK

Référence pour toutes les phases de la refonte. Direction : **« Mix UBB »** — rigueur corporate (sections nettes, hiérarchie claire) + chaleur (photos humaines, arrondis, respirations).

## Où sont les valeurs

| Fichier | Rôle |
|---|---|
| `client/src/styles/tokens.css` | **Source unique** : variables CSS (couleurs en canaux RGB, polices, rayons, ombres) |
| `client/tailwind.config.js` | Expose les tokens sous le préfixe `ubb` (`bg-ubb-navy-900`, `text-ubb-title`, `rounded-ubb-card`…) |
| `client/src/index.css` | Classes de composants `.ubb-*` (boutons, cartes, champs, sections) |
| `client/src/utils/colors.js` | Export `ubb` : mêmes valeurs en hex pour les graphiques et PDF |
| `client/src/components/ui/ds/` | Composants React : `Button`, `Card`, `Section`, `Container`, `SectionHeading` |

L'ancienne palette (`primary-*`, `accent-*`, `vitalCHECK-*`) reste en place pour les écrans non migrés. Chaque phase migre ses écrans vers `ubb-*` ; ne pas modifier `primary` globalement.

## Couleurs

| Token Tailwind | Hex | Usage |
|---|---|---|
| `ubb-navy-900` (`ubb-navy`, `ubb-ink`) | `#13294B` | Texte principal, fonds forts, bouton secondaire |
| `ubb-navy-800` | `#1C3966` | Survol sur navy, dégradés du hero |
| `ubb-navy-100` (`ubb-mist`) | `#E8ECF3` | Sections de respiration |
| `ubb-navy-50` | `#F4F6FA` | Survol léger |
| `ubb-paper-soft` | `#F7F9FC` | Fond alternatif très clair |
| `ubb-gold-500` (`ubb-gold`) | `#F5A83C` | Fond du CTA principal, accents sur navy |
| `ubb-gold-600` | `#E8972A` | Survol du CTA |
| `ubb-gold-ink` | `#A0610F` | Or **en texte** sur fond clair |
| `ubb-ink-muted` | `#4B5B76` | Texte secondaire |

### Règles de contraste (WCAG AA)

- Navy sur blanc : 14.5:1 · navy sur mist : 12.3:1 · `ink-muted` sur blanc : 6.9:1.
- Or `#F5A83C` sur navy : 7.3:1 → OK pour texte ou icône sur fond navy.
- **Or `#F5A83C` sur blanc : 2:1 → interdit pour du texte.** Utiliser `text-ubb-gold-ink`.
- **Jamais de texte blanc sur fond or.** Le CTA or porte un texte navy.

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
