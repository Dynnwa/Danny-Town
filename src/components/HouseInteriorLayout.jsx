import { HouseSketch, WalkingStickman } from './SceneArt'

export function HouseInteriorLayout({
  destination,
  onClose,
  closeButtonRef,
  children,
}) {
  const titleId = `interior-title-${destination.id}`

  return (
    <section
      className="interior-shell"
      data-destination={destination.id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="interior-shell__veil" aria-hidden="true" onClick={onClose} />

      <div className="interior-shell__scroll">
        <article className="interior-shell__frame">
          <div className="interior-shell__rafters" aria-hidden="true" />
          <div
            className="interior-shell__window interior-shell__window--left"
            aria-hidden="true"
          />
          <div
            className="interior-shell__window interior-shell__window--right"
            aria-hidden="true"
          />

          <header className="interior-shell__header">
            <button
              ref={closeButtonRef}
              type="button"
              className="interior-shell__back"
              onClick={onClose}
            >
              Back to town
            </button>

            <div className="interior-shell__heading">
              <p className="interior-shell__eyebrow">Danny Town indoor edition</p>
              <h2 id={titleId}>{destination.title}</h2>
              <p className="interior-shell__tagline">{destination.tagline}</p>
              <p className="interior-shell__intro">{destination.intro}</p>
            </div>

            <div className="interior-shell__stamp">
              <HouseSketch
                variant={destination.variant}
                size="clamp(92px, 10vw, 132px)"
                title={`${destination.label} house sketch`}
              />
              <span>{destination.stampLabel}</span>
            </div>
          </header>

          <div className="interior-shell__host">
            <WalkingStickman
              size="clamp(74px, 8vw, 108px)"
              title={`${destination.label} host`}
            />

            <div className="interior-shell__host-copy">
              <p className="interior-shell__host-label">From the doorway</p>
              <p>{destination.hostMessage}</p>
            </div>
          </div>

          <div className="interior-shell__body">{children}</div>

          <footer className="interior-shell__footer">
            <span>The floorboards creak on purpose.</span>
            <span>Press Escape any time to head back outside.</span>
          </footer>
        </article>
      </div>
    </section>
  )
}

export default HouseInteriorLayout
