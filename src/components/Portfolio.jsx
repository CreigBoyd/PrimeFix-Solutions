import { Link } from 'react-router-dom'
import deckImg from '../assets/portfolio-deck.webp'
import roofImg from '../assets/portfolio-roof.webp'
import yardImg from '../assets/portfolio-yard.webp'
import paintingImg from '../assets/portfolio-painting.webp'

const PROJECTS = [
  {
    img: deckImg,
    alt: 'Newly rebuilt residential back deck with fresh wood decking and modern railing',
    tag: 'Carpentry',
    title: 'Back deck rebuild',
  },
  {
    img: roofImg,
    alt: 'Modern suburban home with a newly installed charcoal shingle roof',
    tag: 'Roofing',
    title: 'Full reshingle',
  },
  {
    img: yardImg,
    alt: 'Well-maintained residential yard with fresh mulch, trimmed shrubs, and clean landscaping',
    tag: 'Yard & grounds',
    title: 'Seasonal cleanup',
  },
  {
    img: paintingImg,
    alt: 'Freshly repainted modern living room with clean walls and dark trim',
    tag: 'Painting',
    title: 'Interior repaint',
  },
]

export default function Portfolio() {
  return (
    <section id="portfolio">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">Recent work</span>
          <h2>A few jobs from around the area.</h2>
          <p>Representative examples of the building, repair, maintenance, and finishing work PrimeFix Solutions handles.</p>
        </div>
        <div className="portfolio-grid">
          {PROJECTS.map((project) => (
            <article className="portfolio-card" key={project.title}>
              <div className="thumb">
               <img 
  src={project.img} 
  alt={project.alt} 
  loading="lazy" 
  decoding="async" 
  width="600"
  height="400"
/>
              </div>
              <div className="cap">
                <span className="tag">{project.tag}</span>
                <h4>{project.title}</h4>
              </div>
            </article>
          ))}
        </div>

        <p className="portfolio-note">
          Representative project examples. Send us photos of your property and we'll help plan the work it needs.
        </p>

        {/* Breadcrumb Link with White Text */}
        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <Link
            to="/portfolio-transformations"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
          >
            <span>Explore Interactive Before &amp; After Transformations</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal-bright, #2dd4bf)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}