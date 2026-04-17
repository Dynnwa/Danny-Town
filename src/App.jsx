import { useEffect, useRef, useState } from 'react'
import { HouseSketch, TreeSketch, WalkingStickman } from './components/SceneArt'
import './App.css'

const TREE_COUNT = 38

const PLAYER_START = {
  x: 0.5,
  y: 0.67,
  facing: 'right',
  isWalking: false,
}

const HOUSE_DESTINATIONS = [
  {
    id: 'about',
    label: 'About',
    variant: 'cottage',
    note: 'Meet the town storyteller',
    placeholder: 'Placeholder for the bio, intro, and backstory.',
  },
  {
    id: 'experience',
    label: 'Experience',
    variant: 'gable',
    note: 'Take a look at the highlights',
    placeholder: 'Placeholder for roles, highlights, and timeline.',
  },
  {
    id: 'resume',
    label: 'Resume',
    variant: 'gable',
    note: 'Grab the formal version',
    placeholder: 'Placeholder for a downloadable resume and summary.',
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    variant: 'cottage',
    note: 'Work in progress',
    placeholder: 'Placeholder for projects, case studies, and experiments.',
  },
]

const TREE_EXCLUSION_ZONES = [
  { left: 0.18, right: 0.82, top: 0.03, bottom: 0.24 },
  { left: 0.12, right: 0.42, top: 0.24, bottom: 0.53 },
  { left: 0.58, right: 0.88, top: 0.24, bottom: 0.53 },
  { left: 0.16, right: 0.44, top: 0.62, bottom: 0.94 },
  { left: 0.56, right: 0.86, top: 0.62, bottom: 0.94 },
  { left: 0.38, right: 0.62, top: 0.5, bottom: 0.82 },
]

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function isInsideExclusionZone(point) {
  return TREE_EXCLUSION_ZONES.some(
    (zone) =>
      point.x >= zone.left &&
      point.x <= zone.right &&
      point.y >= zone.top &&
      point.y <= zone.bottom,
  )
}

function generateTrees() {
  const trees = []
  let attempts = 0

  while (trees.length < TREE_COUNT && attempts < TREE_COUNT * 28) {
    attempts += 1

    const candidate = {
      id: `tree-${trees.length}-${attempts}`,
      x: randomBetween(0.02, 0.98),
      y: randomBetween(0.03, 0.97),
      size: randomBetween(30, 62),
      scale: randomBetween(0.72, 1.22),
      opacity: randomBetween(0.34, 0.9),
      swayDelay: randomBetween(0, 2.6),
      tone: Math.random() > 0.74 ? 'forest' : 'faded',
    }

    if (isInsideExclusionZone(candidate)) {
      continue
    }

    trees.push(candidate)
  }

  return trees
}

function isEditableElement(target) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT')
  )
}

function isInteractiveElement(target) {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest('button, a, input, select, textarea, summary'))
  )
}

function App() {
  const worldRef = useRef(null)
  const keysRef = useRef({
    up: false,
    left: false,
    down: false,
    right: false,
  })
  const playerRef = useRef(PLAYER_START)
  const nearbyHouseIdRef = useRef(null)
  const proximityFocusRef = useRef(null)
  const houseRefs = useRef(new Map())

  const [trees] = useState(() => generateTrees())
  const [player, setPlayer] = useState(PLAYER_START)
  const [nearbyHouseId, setNearbyHouseId] = useState(null)
  const [selectedHouseId, setSelectedHouseId] = useState(null)

  const nearbyHouse =
    HOUSE_DESTINATIONS.find((destination) => destination.id === nearbyHouseId) ??
    null
  const selectedHouse =
    HOUSE_DESTINATIONS.find(
      (destination) => destination.id === selectedHouseId,
    ) ?? null

  function setHouseRef(id, node) {
    if (node) {
      houseRefs.current.set(id, node)
      return
    }

    houseRefs.current.delete(id)
  }

  function activateHouse(destination) {
    setSelectedHouseId(destination.id)
    houseRefs.current.get(destination.id)?.focus({ preventScroll: true })
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat || isEditableElement(event.target)) {
        return
      }

      const key = event.key.toLowerCase()

      if (key === 'escape') {
        setSelectedHouseId(null)
        return
      }

      if (key === 'w' || key === 'arrowup') {
        keysRef.current.up = true
        event.preventDefault()
        return
      }

      if (key === 'a' || key === 'arrowleft') {
        keysRef.current.left = true
        event.preventDefault()
        return
      }

      if (key === 's' || key === 'arrowdown') {
        keysRef.current.down = true
        event.preventDefault()
        return
      }

      if (key === 'd' || key === 'arrowright') {
        keysRef.current.right = true
        event.preventDefault()
        return
      }

      if (
        (key === ' ' || key === 'enter') &&
        nearbyHouseIdRef.current &&
        !isInteractiveElement(event.target)
      ) {
        const destination = HOUSE_DESTINATIONS.find(
          (entry) => entry.id === nearbyHouseIdRef.current,
        )

        if (destination) {
          event.preventDefault()
          activateHouse(destination)
        }
      }
    }

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase()

      if (key === 'w' || key === 'arrowup') {
        keysRef.current.up = false
      }

      if (key === 'a' || key === 'arrowleft') {
        keysRef.current.left = false
      }

      if (key === 's' || key === 'arrowdown') {
        keysRef.current.down = false
      }

      if (key === 'd' || key === 'arrowright') {
        keysRef.current.right = false
      }
    }

    const resetMovement = () => {
      keysRef.current = {
        up: false,
        left: false,
        down: false,
        right: false,
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', resetMovement)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', resetMovement)
    }
  }, [])

  useEffect(() => {
    let frameId = 0
    let lastTimestamp = 0

    const step = (timestamp) => {
      const world = worldRef.current

      if (!world) {
        frameId = window.requestAnimationFrame(step)
        return
      }

      if (lastTimestamp === 0) {
        lastTimestamp = timestamp
      }

      const worldRect = world.getBoundingClientRect()
      const horizontalInput =
        Number(keysRef.current.right) - Number(keysRef.current.left)
      const verticalInput =
        Number(keysRef.current.down) - Number(keysRef.current.up)
      const isMoving = horizontalInput !== 0 || verticalInput !== 0

      let nextPlayer = playerRef.current

      if (isMoving) {
        const elapsed = Math.min(42, timestamp - lastTimestamp)
        const magnitude = Math.hypot(horizontalInput, verticalInput) || 1
        const horizontalSpeed = clamp(worldRect.width * 0.18, 180, 290)
        const verticalSpeed = clamp(worldRect.height * 0.26, 120, 220)
        const nextX = clamp(
          playerRef.current.x +
            ((horizontalInput / magnitude) * horizontalSpeed * elapsed) /
              worldRect.width /
              1000,
          0.08,
          0.92,
        )
        const nextY = clamp(
          playerRef.current.y +
            ((verticalInput / magnitude) * verticalSpeed * elapsed) /
              worldRect.height /
              1000,
          0.34,
          0.84,
        )
        const facing =
          horizontalInput < 0
            ? 'left'
            : horizontalInput > 0
              ? 'right'
              : playerRef.current.facing

        nextPlayer = {
          x: nextX,
          y: nextY,
          facing,
          isWalking: true,
        }

        playerRef.current = nextPlayer
        setPlayer(nextPlayer)
      } else if (playerRef.current.isWalking) {
        nextPlayer = {
          ...playerRef.current,
          isWalking: false,
        }

        playerRef.current = nextPlayer
        setPlayer(nextPlayer)
      }

      let closestId = null
      let closestDistance = Number.POSITIVE_INFINITY

      HOUSE_DESTINATIONS.forEach((destination) => {
        const houseNode = houseRefs.current.get(destination.id)

        if (!houseNode) {
          return
        }

        const houseRect = houseNode.getBoundingClientRect()
        const houseX = houseRect.left - worldRect.left + houseRect.width / 2
        const houseY = houseRect.top - worldRect.top + houseRect.height * 0.7
        const playerX = nextPlayer.x * worldRect.width
        const playerY = nextPlayer.y * worldRect.height
        const distance = Math.hypot(houseX - playerX, houseY - playerY)

        if (distance < closestDistance) {
          closestDistance = distance
          closestId = destination.id
        }
      })

      const threshold = clamp(
        Math.min(worldRect.width, worldRect.height) * 0.15,
        85,
        150,
      )
      const nextNearbyHouseId =
        closestDistance <= threshold ? closestId : null

      if (nextNearbyHouseId !== nearbyHouseIdRef.current) {
        if (proximityFocusRef.current) {
          houseRefs.current.get(proximityFocusRef.current)?.blur()
          proximityFocusRef.current = null
        }

        nearbyHouseIdRef.current = nextNearbyHouseId
        setNearbyHouseId(nextNearbyHouseId)

        if (nextNearbyHouseId) {
          houseRefs.current.get(nextNearbyHouseId)?.focus({
            preventScroll: true,
          })
          proximityFocusRef.current = nextNearbyHouseId
        }
      }

      lastTimestamp = timestamp
      frameId = window.requestAnimationFrame(step)
    }

    frameId = window.requestAnimationFrame(step)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  const hudMessage = selectedHouse
    ? `${selectedHouse.label}: ${selectedHouse.placeholder}`
    : nearbyHouse
      ? `Near ${nearbyHouse.label}. Press Space or Enter to open its placeholder.`
      : 'Walk with WASD or click any house. Everything now lives on one page.'

  return (
    <main className="town-shell">
      <div className="town-world" ref={worldRef}>
        <div className="town-forest" aria-hidden="true">
          {trees.map((tree) => (
            <div
              key={tree.id}
              className="tree-spot"
              style={{
                left: `${tree.x * 100}%`,
                top: `${tree.y * 100}%`,
                '--tree-scale': tree.scale,
                '--tree-opacity': tree.opacity,
                '--tree-delay': `${tree.swayDelay}s`,
              }}
            >
              <TreeSketch size={tree.size} tone={tree.tone} />
            </div>
          ))}
        </div>

        <header className="town-hero">
          <p className="town-overline">Danny Town</p>
          <h1>Welcome to Danny Town</h1>
          <p className="town-tagline">Let&apos;s take a walk</p>
          <p className="town-directions">
            Use <span>WASD</span> to walk the stickman, or click a house to open
            its placeholder right here on the page.
          </p>
        </header>

        <section
          className="town-districts"
          aria-label="Danny Town destinations"
        >
          {HOUSE_DESTINATIONS.map((destination) => {
            const isNearby = nearbyHouseId === destination.id
            const isSelected = selectedHouseId === destination.id

            return (
              <button
                key={destination.id}
                ref={(node) => setHouseRef(destination.id, node)}
                type="button"
                className={`district-house${isNearby ? ' is-nearby' : ''}${isSelected ? ' is-selected' : ''}`}
                data-district={destination.id}
                aria-pressed={isSelected}
                onClick={() => activateHouse(destination)}
              >
                <span className="district-label">{destination.label}</span>
                <HouseSketch
                  variant={destination.variant}
                  highlighted={isNearby || isSelected}
                  title={destination.label}
                  size="clamp(110px, 9vw, 180px)"
                />
                <span className="district-note">{destination.note}</span>
                <span className="district-cta">
                  {isSelected
                    ? 'Opened here'
                    : isNearby
                      ? 'Press Space or Enter'
                      : 'Click to open'}
                </span>
              </button>
            )
          })}
        </section>

        <div
          className="town-player"
          style={{
            left: `${player.x * 100}%`,
            top: `${player.y * 100}%`,
          }}
          aria-hidden="true"
        >
          <div className="town-player-shadow" />
          <WalkingStickman
            className="town-player-figure"
            isWalking={player.isWalking}
            facing={player.facing}
            size="clamp(70px, 5vw, 96px)"
          />
        </div>

        <aside className="town-hud" aria-live="polite">
          {hudMessage}
        </aside>
      </div>
    </main>
  )
}

export default App
