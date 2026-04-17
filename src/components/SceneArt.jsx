/* eslint-disable react-refresh/only-export-components */
import './sceneArt.css'

export const TREE_VARIANTS = ['puff', 'breezy', 'tall']
export const HOUSE_VARIANTS = ['cottage', 'gable']

const TONE_STYLES = {
  ink: {
    '--scene-stroke': '#18120f',
    '--scene-fill': 'rgba(255, 255, 255, 0.24)',
    '--scene-shadow': 'rgba(24, 18, 15, 0.12)',
  },
  faded: {
    '--scene-stroke': '#76695f',
    '--scene-fill': 'rgba(255, 255, 255, 0.18)',
    '--scene-shadow': 'rgba(118, 105, 95, 0.12)',
  },
  forest: {
    '--scene-stroke': '#4c5a44',
    '--scene-fill': 'rgba(122, 144, 109, 0.16)',
    '--scene-shadow': 'rgba(76, 90, 68, 0.12)',
  },
}

const DIRECTION_SCALE = {
  left: -1,
  right: 1,
  up: 1,
  down: 1,
}

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

function toCssSize(value, fallback) {
  if (typeof value === 'number') {
    return `${value}px`
  }

  return value ?? fallback
}

function toCssAngle(value, fallback = '0deg') {
  if (typeof value === 'number') {
    return `${value}deg`
  }

  return value ?? fallback
}

function getArtA11y({ decorative = true, title, fallback }) {
  if (decorative && !title) {
    return {
      'aria-hidden': true,
    }
  }

  return {
    role: 'img',
    'aria-label': title || fallback,
  }
}

function getToneStyle(tone) {
  if (!tone) {
    return {}
  }

  if (TONE_STYLES[tone]) {
    return TONE_STYLES[tone]
  }

  return {
    '--scene-stroke': tone,
  }
}

function hashString(value) {
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function createRng(seedValue) {
  let seed = seedValue >>> 0

  return () => {
    seed += 0x6d2b79f5
    let mixed = Math.imul(seed ^ (seed >>> 15), seed | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}

function normalizeSeed(seed) {
  if (typeof seed === 'number' && Number.isFinite(seed)) {
    return Math.abs(Math.floor(seed * 1000000)) || 1
  }

  if (typeof seed === 'string' && seed.length > 0) {
    return hashString(seed)
  }

  return Math.floor(Math.random() * 1000000) || 1
}

function round(value, digits = 2) {
  return Number(value.toFixed(digits))
}

export function createTreeScatter(options = {}) {
  const {
    count = 40,
    width = 100,
    height = 100,
    padding = 4,
    minSize = 28,
    maxSize = 60,
    variants = TREE_VARIANTS,
    seed = Math.random(),
  } = options

  const safeVariants = variants.length > 0 ? variants : TREE_VARIANTS
  const rng = createRng(normalizeSeed(seed))
  const usableWidth = Math.max(width - padding * 2, 0)
  const usableHeight = Math.max(height - padding * 2, 0)

  return Array.from({ length: count }, (_, index) => ({
    id: `tree-${index}-${Math.floor(rng() * 100000)}`,
    x: round(padding + rng() * usableWidth),
    y: round(padding + rng() * usableHeight),
    size: round(minSize + rng() * (maxSize - minSize)),
    variant: safeVariants[Math.floor(rng() * safeVariants.length)],
    tilt: round(-7 + rng() * 14),
    mirrored: rng() > 0.5,
    opacity: round(0.68 + rng() * 0.28),
  }))
}

function TreeCanopy({ variant }) {
  if (variant === 'breezy') {
    return (
      <>
        <path
          className="scene-tree__canopy"
          d="M18 48c0-12 10-21 22-21 5-11 15-18 27-18 15 0 27 11 28 25 7 1 13 7 13 15 0 10-8 18-18 18H32C24 67 18 59 18 48Z"
        />
        <path
          className="scene-tree__canopy-detail"
          d="M34 33c8-6 18-8 29-7m-31 14c11-5 28-6 42-3m-33 15c8 1 16 1 24-1"
        />
      </>
    )
  }

  if (variant === 'tall') {
    return (
      <>
        <path
          className="scene-tree__canopy"
          d="M50 8c-10 0-19 7-21 17-9 2-16 10-16 20 0 11 9 20 20 20h35c11 0 20-9 20-20 0-9-6-17-15-20-1-10-10-17-23-17Z"
        />
        <path
          className="scene-tree__canopy"
          d="M30 34c0-10 8-18 18-18 3-7 9-12 18-12 11 0 20 8 21 19 8 1 14 8 14 16 0 10-8 18-18 18H48c-10 0-18-8-18-18Z"
        />
      </>
    )
  }

  return (
    <>
      <path
        className="scene-tree__canopy"
        d="M21 52c-1-11 6-21 18-24 4-11 15-18 27-18 13 0 24 7 29 18 11 2 19 12 18 24-1 13-11 22-24 22H44C31 74 22 65 21 52Z"
      />
      <path
        className="scene-tree__canopy-detail"
        d="M34 32c7-6 18-9 31-7m-37 16c9-5 22-7 38-5m-26 20c9 1 18 0 28-3"
      />
    </>
  )
}

export function TreeArt({
  variant = 'puff',
  size = 52,
  tone = 'ink',
  tilt = 0,
  mirrored = false,
  decorative = true,
  title,
  className,
  style,
  ...rest
}) {
  const safeVariant = TREE_VARIANTS.includes(variant) ? variant : 'puff'
  const a11yProps = getArtA11y({
    decorative,
    title,
    fallback: 'Placeholder tree',
  })

  return (
    <span
      className={cx('scene-art', 'scene-tree', `scene-tree--${safeVariant}`, className)}
      style={{
        ...getToneStyle(tone),
        '--scene-size': toCssSize(size, '52px'),
        '--scene-tilt': toCssAngle(tilt),
        '--scene-scale-x': mirrored ? -1 : 1,
        ...style,
      }}
      {...rest}
    >
      <svg viewBox="0 0 120 132" {...a11yProps}>
        <TreeCanopy variant={safeVariant} />
        <path
          className="scene-tree__trunk"
          d="M56 64c0 14-3 27-8 42m15-39c1 13 2 25 5 38m-8-25c4 6 9 11 15 15m-18-8c-6 2-11 6-16 11"
        />
        <path className="scene-tree__ground" d="M38 111c8-2 17-4 27-4 9 0 18 2 27 4" />
      </svg>
    </span>
  )
}

function CottageHouse() {
  return (
    <>
      <path className="scene-house__outline" d="M30 94 75 50l44 43" />
      <path className="scene-house__roof" d="M40 90 75 56l35 34" />
      <path className="scene-house__body-fill" d="M43 88h64v48H43z" />
      <path className="scene-house__outline" d="M43 88h64v48H43z" />
      <path className="scene-house__outline" d="M69 101h16v35H69z" />
      <path className="scene-house__outline" d="M49 99h15v15H49zm42 0h11v11H91z" />
      <path className="scene-house__outline" d="M64 66h22v16H64z" />
      <path className="scene-house__outline" d="M74 66v16m-10-8h20" />
      <path className="scene-house__outline" d="M56 136v-17m-7 17v-12m59 12v-17m7 17v-12" />
      <path className="scene-house__outline" d="M49 136c7-5 16-8 26-8 9 0 19 3 27 8" />
      <path className="scene-house__outline" d="M58 46h8v21" />
      <path className="scene-house__smoke" d="M62 40c4-4 4-8 1-12m4 22c4-4 4-8 1-12" />
    </>
  )
}

function GableHouse() {
  return (
    <>
      <path className="scene-house__outline" d="M40 132V81l32-43 38 43v51" />
      <path className="scene-house__roof" d="M40 82 72 38l38 44" />
      <path className="scene-house__outline" d="M56 132V93h38v39" />
      <path className="scene-house__outline" d="M48 109h54" />
      <path className="scene-house__outline" d="M61 100h12v9H61zm20 0h13v9H81z" />
      <path className="scene-house__outline" d="M66 76h19v16H66z" />
      <path className="scene-house__body-fill" d="M69 115h15v17H69z" />
      <path className="scene-house__outline" d="M69 115h15v17H69z" />
      <path className="scene-house__outline" d="M48 132c4-6 8-10 15-12m24 12c5-7 10-10 16-12" />
      <path className="scene-house__outline" d="M84 45h8v19" />
      <path className="scene-house__smoke" d="M88 38c3-4 3-8 0-12m4 20c3-4 3-8 0-12" />
      <path className="scene-house__outline" d="M63 132h28" />
    </>
  )
}

export function HouseArt({
  variant = 'cottage',
  size = 176,
  highlighted,
  active = false,
  mirrored = false,
  decorative = true,
  title,
  className,
  style,
  ...rest
}) {
  const safeVariant = HOUSE_VARIANTS.includes(variant) ? variant : 'cottage'
  const isActive = highlighted ?? active
  const a11yProps = getArtA11y({
    decorative,
    title,
    fallback: `Placeholder ${safeVariant} house`,
  })

  return (
    <span
      className={cx('scene-art', 'scene-house', `scene-house--${safeVariant}`, className)}
      data-active={isActive}
      style={{
        '--scene-size': toCssSize(size, '176px'),
        '--scene-scale-x': mirrored ? -1 : 1,
        ...style,
      }}
      {...rest}
    >
      <svg viewBox="0 0 150 154" {...a11yProps}>
        {safeVariant === 'gable' ? <GableHouse /> : <CottageHouse />}
        <path className="scene-house__ground" d="M18 142c18 3 37 5 57 5 19 0 39-2 57-5" />
      </svg>
    </span>
  )
}

export function CharacterArt({
  size = 88,
  facing,
  direction = 'down',
  isWalking,
  walking = false,
  decorative = true,
  title,
  className,
  style,
  ...rest
}) {
  const safeDirection = DIRECTION_SCALE[facing] ? facing : DIRECTION_SCALE[direction] ? direction : 'down'
  const walkingState = isWalking ?? walking
  const a11yProps = getArtA11y({
    decorative,
    title,
    fallback: 'Placeholder walking character',
  })

  return (
    <span
      className={cx(
        'scene-art',
        'scene-character',
        `scene-character--${safeDirection}`,
        walkingState ? 'scene-character--walking' : 'scene-character--idle',
        className,
      )}
      style={{
        '--scene-size': toCssSize(size, '88px'),
        '--scene-scale-x': DIRECTION_SCALE[safeDirection],
        ...style,
      }}
      {...rest}
    >
      <svg viewBox="0 0 96 170" {...a11yProps}>
        <ellipse className="scene-character__shadow" cx="48" cy="154" rx="20" ry="6" />
        <g className="scene-character__dust scene-character__dust--left">
          <path d="M12 148c4-7 7-12 10-16" />
        </g>
        <g className="scene-character__dust scene-character__dust--right">
          <path d="M76 147c2-6 6-11 10-15" />
        </g>
        <g className="scene-character__body">
          <circle className="scene-character__head" cx="48" cy="34" r="18" />
          <g className="scene-character__face">
            <path className="scene-character__outline" d="M42 31c1-2 2-3 3-3m11 0c1-2 2-3 3-3" />
            <path className="scene-character__outline" d="M41 42c5 4 10 5 15 4" />
          </g>
          <path className="scene-character__outline" d="M61 18c4 5 5 10 3 16" />
          <path className="scene-character__outline" d="M48 52c-1 18-2 37 2 62" />
          <g className="scene-character__arm scene-character__arm--left">
            <path className="scene-character__outline" d="M48 64c-9 9-15 20-17 34" />
          </g>
          <g className="scene-character__arm scene-character__arm--right">
            <path className="scene-character__outline" d="M49 65c10 9 17 20 21 34" />
          </g>
          <g className="scene-character__leg scene-character__leg--left">
            <path className="scene-character__outline" d="M51 113c-8 13-13 26-13 40" />
          </g>
          <g className="scene-character__leg scene-character__leg--right">
            <path className="scene-character__outline" d="M52 113c4 14 7 27 6 40" />
          </g>
          <path className="scene-character__outline" d="M37 153c2-2 4-3 7-3m13 3c3-2 5-3 8-3" />
        </g>
      </svg>
    </span>
  )
}

export function TreeSketch(props) {
  return <TreeArt {...props} />
}

export function HouseSketch(props) {
  return <HouseArt {...props} />
}

export function WalkingStickman(props) {
  return <CharacterArt {...props} />
}

const SceneArt = {
  TreeSketch,
  HouseSketch,
  WalkingStickman,
  TreeArt,
  HouseArt,
  CharacterArt,
  createTreeScatter,
  TREE_VARIANTS,
  HOUSE_VARIANTS,
}

export default SceneArt
