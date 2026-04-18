import { useId } from 'react'
import { CharacterArt, HouseArt } from './SceneArt'
import './ResumeContactPages.css'

const DEFAULT_RESUME_FACTS = [
  {
    label: 'Home base',
    value: 'Vancouver, British Columbia',
  },
  {
    label: 'Education',
    value: 'UBC combined major in Computer Science and Statistics',
  },
  {
    label: 'Graduation',
    value: 'Expected December 2024',
  },
  {
    label: 'On the web',
    value: 'github.com/Dynnwa • dwei.dev',
  },
]

const DEFAULT_RESUME_SECTIONS = [
  {
    id: 'highlights',
    title: 'Highlights',
    items: [
      'Helped build a tool at SAP that saved $1 billion in cloud costs.',
      'Cut production deployment times by 50% at SAP with Groovy and Jenkins.',
      'Reduced disaster response time by 19% with a build-systems dashboard at SAP.',
      'Helped lower monthly infrastructure cost by 18% at Diligent.',
    ],
  },
  {
    id: 'experience',
    title: 'Recent chapters',
    items: [
      'SAP, Software Engineer I, June 2024 to July 2025',
      'SAP, DevOps Engineer Intern, September 2023 to June 2024',
      'Diligent, Software Engineer Intern, January 2023 to August 2023',
      'Copperleaf Technologies, Software Engineer Intern, January 2022 to August 2022',
    ],
  },
  {
    id: 'toolbox',
    title: 'Toolbox',
    items: [
      'JavaScript, Python, React, Java, C#, Terraform, HTML/CSS, SQL, Node.js',
      'Docker, Shell, Jenkins, Oracle, AWS, Grafana',
      'NumPy, Pandas, PyTorch, R',
    ],
  },
  {
    id: 'projects',
    title: 'Projects',
    items: [
      'Fullstack photo sharing album built with React, Redux, Express, and MongoDB',
      'Transit system database app built with PHP and Oracle SQL',
      'REST APIs, state management, and full-stack data modeling work',
    ],
  },
]

const DEFAULT_CONTACT_STORES = [
  {
    id: 'linkedin',
    name: 'LinkedIn Lane',
    kind: 'Professional Porch',
    href: 'https://www.linkedin.com/in/dlwei/',
    value: 'linkedin.com/in/dlwei',
    action: 'Step onto LinkedIn',
    variant: 'gable',
    accent: 'rgba(102, 131, 122, 0.22)',
  },
  {
    id: 'email',
    name: 'Mailbox Market',
    kind: 'Letter Shop',
    href: 'mailto:ddaniel.wei@gmail.com',
    value: 'ddaniel.wei@gmail.com',
    action: 'Send an email',
    variant: 'cottage',
    accent: 'rgba(197, 145, 92, 0.22)',
  },
  {
    id: 'phone',
    name: 'Ring Ring Corner',
    kind: 'Phone Boothery',
    href: 'tel:+16047106896',
    value: '(604) 710-6896',
    action: 'Give Danny a call',
    variant: 'gable',
    accent: 'rgba(142, 123, 94, 0.22)',
  },
]

const SHOP_OFFSETS = [
  { tilt: '-1.4deg', nudge: '0px' },
  { tilt: '1deg', nudge: '14px' },
  { tilt: '-0.8deg', nudge: '6px' },
]

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

function getExternalLinkProps(href) {
  if (/^https?:\/\//i.test(href)) {
    return {
      target: '_blank',
      rel: 'noreferrer',
    }
  }

  return {}
}

function ResumeDownloadFigureLink({
  href,
  fileName,
  label,
  caption,
}) {
  const downloadProps = fileName
    ? {
        download: fileName,
      }
    : {}

  return (
    <a
      className="resume-download-link"
      href={href}
      aria-label={`${label}. ${caption}`}
      {...downloadProps}
    >
      <span className="resume-download-link__bubble">{label}</span>
      <span className="resume-download-link__figure" aria-hidden="true">
        <CharacterArt size={80} />
      </span>
      <span className="resume-download-link__caption">{caption}</span>
    </a>
  )
}

function ResumePreviewPlaceholder({
  previewTitle,
  name,
  summary,
  facts,
  sections,
}) {
  return (
    <article className="resume-preview-sheet" aria-label={previewTitle}>
      <header className="resume-preview-sheet__hero">
        <div>
          <p className="resume-preview-sheet__overline">Pinned on the living room wall</p>
          <h3 className="resume-preview-sheet__name">{name}</h3>
          <p className="resume-preview-sheet__summary">{summary}</p>
        </div>

        <dl className="resume-preview-sheet__facts">
          {facts.map((fact) => (
            <div className="resume-preview-sheet__fact" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="resume-preview-sheet__grid">
        {sections.map((section) => (
          <section className="resume-preview-sheet__section" key={section.id}>
            <h4 className="resume-preview-sheet__section-title">{section.title}</h4>
            <ul className="resume-preview-sheet__list">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="resume-preview-sheet__swap-note">
        Later this wall can swap over to an embedded PDF while keeping the same
        cozy frame.
      </p>
    </article>
  )
}

function ContactShopLink({ store, index }) {
  const offset = SHOP_OFFSETS[index % SHOP_OFFSETS.length]

  return (
    <a
      className="contact-shop"
      data-shop={store.id}
      href={store.href}
      aria-label={`${store.name}. ${store.value}. ${store.action}.`}
      style={{
        '--shop-accent': store.accent,
        '--shop-tilt': offset.tilt,
        '--shop-nudge': offset.nudge,
      }}
      {...getExternalLinkProps(store.href)}
    >
      <span className="contact-shop__label">{store.name}</span>
      <span className="contact-shop__house" aria-hidden="true">
        <HouseArt variant={store.variant} size={108} />
      </span>
      <span className="contact-shop__kind">{store.kind}</span>
      <span className="contact-shop__value">{store.value}</span>
      <span className="contact-shop__action">{store.action}</span>
    </a>
  )
}

export function ResumePageContent({
  className,
  eyebrow = 'The polished papers house',
  title = 'Resume House',
  intro = 'A tidy little room for the formal version, plus a wall preview so no one has to download first.',
  resumeDownloadHref = '/danny-wei-resume.pdf',
  resumeDownloadFileName = 'Danny-Wei-Resume.pdf',
  resumeDownloadLabel = 'This stick fellow is carrying Danny Wei’s resume',
  resumeDownloadCaption = 'Download the real PDF.',
  resumePreviewSrc = '/danny-wei-resume.pdf',
  resumePreviewTitle = 'Resume preview',
  resumeName = 'Danny Wei',
  summary = 'Software engineer and UBC Computer Science plus Statistics student with experience across SAP product engineering, DevOps, cloud infrastructure, and data-focused systems.',
  facts = DEFAULT_RESUME_FACTS,
  sections = DEFAULT_RESUME_SECTIONS,
}) {
  const headingId = useId()

  return (
    <section
      className={cx('town-destination-page', 'resume-page-content', className)}
      aria-labelledby={headingId}
    >
      <header className="town-destination-page__header">
        <p className="town-destination-page__eyebrow">{eyebrow}</p>
        <h2 className="town-destination-page__title" id={headingId}>
          {title}
        </h2>
        <p className="town-destination-page__intro">{intro}</p>
      </header>

      <div className="resume-page-content__layout">
        <aside className="resume-page-content__porch">
          <div className="resume-page-content__house-card">
            <span className="resume-page-content__house-art" aria-hidden="true">
              <HouseArt variant="gable" size={150} active />
            </span>
            <p className="resume-page-content__house-note">
              The front room keeps the neat version ready while the wall inside
              shows a preview.
            </p>
          </div>

          <ResumeDownloadFigureLink
            href={resumeDownloadHref}
            fileName={resumeDownloadFileName}
            label={resumeDownloadLabel}
            caption={resumeDownloadCaption}
          />
        </aside>

        <div className="resume-preview-card">
          <span className="resume-preview-card__pin resume-preview-card__pin--left" />
          <span className="resume-preview-card__pin resume-preview-card__pin--right" />

          <div className="resume-preview-card__frame">
            {resumePreviewSrc ? (
              <iframe
                className="resume-preview-card__iframe"
                src={resumePreviewSrc}
                title={resumePreviewTitle}
              />
            ) : (
              <ResumePreviewPlaceholder
                previewTitle={resumePreviewTitle}
                name={resumeName}
                summary={summary}
                facts={facts}
                sections={sections}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ContactShops({
  className,
  heading,
  intro,
  stores = DEFAULT_CONTACT_STORES,
}) {
  const headingId = useId()
  const regionProps = heading
    ? {
        'aria-labelledby': headingId,
      }
    : {
        'aria-label': 'Contact shops',
      }

  return (
    <section className={cx('contact-shops', className)} {...regionProps}>
      {heading || intro ? (
        <header className="contact-shops__header">
          {heading ? (
            <h3 className="contact-shops__title" id={headingId}>
              {heading}
            </h3>
          ) : null}
          {intro ? <p className="contact-shops__intro">{intro}</p> : null}
        </header>
      ) : null}

      <div className="contact-shops__cluster">
        {stores.map((store, index) => (
          <ContactShopLink key={store.id} store={store} index={index} />
        ))}
      </div>
    </section>
  )
}

export function ContactPageContent({
  className,
  eyebrow = 'The storefront block',
  title = 'Contact Corner',
  intro = 'Instead of a fourth house interior, this block keeps the town map social with three tiny house links that go straight to the real ways to reach you.',
  shopsHeading = 'Pick a little storefront',
  shopsIntro = 'Each shop can open the real contact path once you swap in your own details.',
  stores = DEFAULT_CONTACT_STORES,
}) {
  const headingId = useId()

  return (
    <section
      className={cx('town-destination-page', 'contact-page-content', className)}
      aria-labelledby={headingId}
    >
      <header className="town-destination-page__header">
        <p className="town-destination-page__eyebrow">{eyebrow}</p>
        <h2 className="town-destination-page__title" id={headingId}>
          {title}
        </h2>
        <p className="town-destination-page__intro">{intro}</p>
      </header>

      <div className="contact-page-content__layout">
        <aside className="contact-page-content__note">
          <span className="contact-page-content__note-art" aria-hidden="true">
            <HouseArt variant="cottage" size={138} />
          </span>
          <p className="contact-page-content__note-copy">
            This cluster is reusable on the town map too, so it can live right
            where the old portfolio house used to be.
          </p>
        </aside>

        <ContactShops
          stores={stores}
          heading={shopsHeading}
          intro={shopsIntro}
        />
      </div>
    </section>
  )
}
