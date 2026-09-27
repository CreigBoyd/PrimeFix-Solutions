import deckImg from '../assets/portfolio-deck.jpg'
import roofImg from '../assets/portfolio-roof.jpg'
import yardImg from '../assets/portfolio-yard.jpg'
import paintingImg from '../assets/portfolio-painting.jpg'

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
                <img src={project.img} alt={project.alt} loading="lazy" decoding="async" />
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
      </div>
    </section>
  )
}
