import { useId, useState } from 'react'
import { WalkingStickman } from './SceneArt'
import './AboutExperiencePages.css'

const DEFAULT_ABOUT_SUMMARY = [
  'Born and raised in Vancouver, BC, I studied Computer Science and Statistics at UBC and like bringing a thoughtful, practical energy to the things I build.',
  'Outside of work, I was a former Team Canada powerlifter and I spend a lot of time moving: snowboarding, skiing, getting into backcountry skiing, bouldering, lifting, and playing rec volleyball.',
]

const DEFAULT_ABOUT_INTERESTS = [
  {
    id: 'mountains',
    name: 'Mountain Kid',
    badge: 'Mud room',
    title: 'Snowboarding, skiing, and getting into backcountry skiing',
    description:
      'A lot of my favorite days start with a mountain forecast. I love snowboarding and skiing, and lately I have been starting to get into backcountry skiing too.',
    snippets: ['powder days', 'chairlift mornings', 'backcountry beginner'],
    facing: 'right',
    size: '80px',
  },
  {
    id: 'strength',
    name: 'Strength Person',
    badge: 'Garage gym',
    title: 'Former Team Canada powerlifting and still love lifting',
    description:
      'Strength sports have been a big part of my life. I used to compete as Team Canada in powerlifting, and lifting is still one of the main ways I reset and stay grounded.',
    snippets: ['Team Canada powerlifting', 'gym routine', 'strength work'],
    facing: 'left',
    size: '82px',
  },
  {
    id: 'climber',
    name: 'Bouldering Buddy',
    badge: 'Climbing wall',
    title: 'Bouldering for movement and problem solving',
    description:
      'Bouldering scratches the same part of my brain that likes puzzles. It is equal parts movement, patience, and figuring out a better way up.',
    snippets: ['beta chats', 'problem solving', 'climbing sessions'],
    facing: 'right',
    size: '78px',
  },
  {
    id: 'volleyball',
    name: 'Court Regular',
    badge: 'Back yard court',
    title: 'Rec volleyball and good team energy',
    description:
      'Rec volleyball is one of my favorite ways to stay active with other people. It keeps the fun, the teamwork, and just enough competitive energy in the mix.',
    snippets: ['rec league nights', 'team energy', 'keep it fun'],
    facing: 'left',
    size: '78px',
  },
]

const DEFAULT_EXPERIENCE_ITEMS = [
  {
    id: 'sap-software',
    name: 'SAP UI5',
    badge: 'Main room',
    title: 'SAP • Software Engineer I',
    timeframe: 'June 2024 to July 2025',
    description:
      'Contributed to a tool that saved SAP $1 billion in cloud costs, overhauled the SAP UI5 menu system, shipped report sharing, and improved front-end performance by refactoring legacy code into a more modular design.',
    snippets: [
      '$1B in cloud cost savings',
      'UI5 menu overhaul',
      'report-sharing release',
    ],
    facing: 'right',
    size: '82px',
  },
  {
    id: 'sap-devops',
    name: 'SAP DevOps',
    badge: 'Cloud hallway',
    title: 'SAP • DevOps Engineer Intern',
    timeframe: 'September 2023 to June 2024',
    description:
      'Built Groovy and Jenkins tooling that cut production deployment times by 50 percent, created a dashboard that reduced disaster response time by 19 percent, hardened serverless Gerrit testing, and explored machine-learning-assisted failure classification.',
    snippets: [
      '50% faster deployments',
      '19% faster disaster response',
      'Groovy and Jenkins automation',
    ],
    facing: 'left',
    size: '84px',
  },
  {
    id: 'diligent',
    name: 'Diligent',
    badge: 'Release kitchen',
    title: 'Diligent • Software Engineer Intern',
    timeframe: 'January 2023 to August 2023',
    description:
      'Owned front-end work in React for a release-critical product area, partnered with designers, and helped move infrastructure from an in-house setup to AWS with Terraform.',
    snippets: [
      'sole React front-end owner',
      '18% lower monthly cost',
      'AWS and Terraform migration',
    ],
    facing: 'right',
    size: '80px',
  },
  {
    id: 'copperleaf',
    name: 'Copperleaf',
    badge: 'Basement workshop',
    title: 'Copperleaf Technologies • Software Engineer Intern',
    timeframe: 'January 2022 to August 2022',
    description:
      'Improved Oracle database performance, refreshed legacy Angular components, and helped lay down foundational interfaces in C# during early project work.',
    snippets: [
      '30% faster data retrieval',
      'Angular component refresh',
      'C# interface groundwork',
    ],
    facing: 'left',
    size: '80px',
  },
]

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

function normalizeParagraphs(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  if (typeof value === 'string' && value.trim()) {
    return [value]
  }

  return []
}

function HousePageShell({ eyebrow, title, subtitle, accent = 'about', className, children }) {
  return (
    <section className={cx('house-page', `house-page--${accent}`, className)}>
      <header className="house-page__header">
        <p className="house-page__eyebrow">{eyebrow}</p>
        <h2 className="house-page__title">{title}</h2>
        <p className="house-page__subtitle">{subtitle}</p>
        <div className="house-page__doodle" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </header>
      {children}
    </section>
  )
}

function RoomCard({ label, title, className, children }) {
  return (
    <section className={cx('house-room', className)}>
      <p className="house-room__label">{label}</p>
      <h3 className="house-room__title">{title}</h3>
      {children}
    </section>
  )
}

function ResidentCluster({
  label,
  title,
  hint,
  residents,
  detailFallbackTitle,
  detailFallbackText,
  className,
}) {
  const headingId = useId()
  const detailId = useId()
  const [activeResidentId, setActiveResidentId] = useState(() => residents[0]?.id ?? null)

  const activeResident =
    residents.find((resident) => resident.id === activeResidentId) ?? residents[0] ?? null

  return (
    <section
      className={cx('house-room', 'resident-room', className)}
      aria-labelledby={headingId}
    >
      <p className="house-room__label">{label}</p>
      <div className="resident-room__heading">
        <h3 className="house-room__title" id={headingId}>
          {title}
        </h3>
        <p className="resident-room__hint">{hint}</p>
      </div>

      {residents.length > 0 ? (
        <div className="resident-room__layout">
          <ul className="resident-room__list">
            {residents.map((resident, index) => {
              const isActive = resident.id === activeResident?.id

              return (
                <li key={resident.id} className="resident-room__item">
                  <button
                    type="button"
                    className="resident-button"
                    data-active={isActive}
                    data-figure-index={index % 4}
                    aria-controls={detailId}
                    aria-pressed={isActive}
                    onMouseEnter={() => setActiveResidentId(resident.id)}
                    onFocus={() => setActiveResidentId(resident.id)}
                    onClick={() => setActiveResidentId(resident.id)}
                  >
                    <span className="resident-button__figure" aria-hidden="true">
                      <WalkingStickman
                        facing={resident.facing ?? (index % 2 === 0 ? 'right' : 'left')}
                        isWalking={isActive}
                        size={resident.size ?? '82px'}
                      />
                    </span>
                    <span className="resident-button__name">{resident.name}</span>
                    {resident.badge ? (
                      <span className="resident-button__badge">{resident.badge}</span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>

          <article className="resident-detail" id={detailId} aria-live="polite">
            <p className="resident-detail__eyebrow">
              {activeResident?.badge ?? 'Tap a resident'}
            </p>
            <h4 className="resident-detail__title">
              {activeResident?.title ?? detailFallbackTitle}
            </h4>
            {activeResident?.timeframe ? (
              <p className="resident-detail__timeframe">{activeResident.timeframe}</p>
            ) : null}
            <p className="resident-detail__body">
              {activeResident?.description ?? detailFallbackText}
            </p>
            {activeResident?.snippets?.length ? (
              <ul className="resident-detail__snippets" aria-label="Highlights">
                {activeResident.snippets.map((snippet) => (
                  <li key={snippet}>{snippet}</li>
                ))}
              </ul>
            ) : null}
          </article>
        </div>
      ) : (
        <p className="resident-room__empty">
          {detailFallbackText}
        </p>
      )}
    </section>
  )
}

export function AboutPageContent({
  className,
  eyebrow = 'About House',
  title = 'Welcome to the living room',
  subtitle = 'A cozy little corner for your summary, your vibe, and a few delightful side quests.',
  summaryLabel = 'Front room',
  summaryTitle = 'A short summary about you',
  summary = DEFAULT_ABOUT_SUMMARY,
  interestsLabel = 'Side room',
  interestsTitle = 'Meet the hobby residents',
  interestsHint = 'Hover, focus, or tap a stick person to hear what they are into.',
  interests = DEFAULT_ABOUT_INTERESTS,
}) {
  const paragraphs = normalizeParagraphs(summary)

  return (
    <HousePageShell
      accent="about"
      className={className}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
    >
      <div className="house-page__grid house-page__grid--about">
        <RoomCard className="house-room--summary" label={summaryLabel} title={summaryTitle}>
          <div className="house-summary">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>Add a quick introduction here so visitors know who you are and what you do.</p>
            )}
          </div>

          <div className="house-summary__mini-notes" aria-hidden="true">
            <span>replace me</span>
            <span>add your voice</span>
            <span>make it yours</span>
          </div>
        </RoomCard>

        <ResidentCluster
          className="house-room--residents"
          label={interestsLabel}
          title={interestsTitle}
          hint={interestsHint}
          residents={interests}
          detailFallbackTitle="Pick a hobby resident"
          detailFallbackText="Add a few stick people here so each one can introduce a hobby, interest, or joyful obsession."
        />
      </div>
    </HousePageShell>
  )
}

export function ExperiencePageContent({
  className,
  eyebrow = 'Experience House',
  title = 'Walk down the hallway of past roles',
  subtitle = 'Each resident here stands in for a real chapter at SAP, Diligent, or Copperleaf, with the strongest wins and tools tucked into the walls.',
  introLabel = 'Entryway',
  introTitle = 'How to read the room',
  intro = 'This hallway now follows two different roles at SAP plus earlier internships at Diligent and Copperleaf, moving from DevOps and cloud systems into product-facing front-end engineering.',
  experiencesLabel = 'Hallway',
  experiencesTitle = 'Past role residents',
  experiencesHint = 'Hover, focus, or tap each figure to reveal that chapter of Danny Wei’s experience.',
  experiences = DEFAULT_EXPERIENCE_ITEMS,
}) {
  const paragraphs = normalizeParagraphs(intro)

  return (
    <HousePageShell
      accent="experience"
      className={className}
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
    >
      <div className="house-page__grid house-page__grid--experience">
        <RoomCard className="house-room--intro" label={introLabel} title={introTitle}>
          <div className="house-summary">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>Describe how you want this experience page to be read.</p>
            )}
          </div>

          <ul className="experience-notes">
            <li>Company and role</li>
            <li>What you owned</li>
            <li>What changed because you were there</li>
          </ul>
        </RoomCard>

        <ResidentCluster
          className="house-room--residents"
          label={experiencesLabel}
          title={experiencesTitle}
          hint={experiencesHint}
          residents={experiences}
          detailFallbackTitle="Pick a role resident"
          detailFallbackText="Add each past role as a stick person here so visitors can wander through your experience in a more playful way."
        />
      </div>
    </HousePageShell>
  )
}
