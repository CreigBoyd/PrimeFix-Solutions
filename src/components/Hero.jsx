import heroSmall from '../assets/hero-renovation-480.webp'
import heroLarge from '../assets/hero-renovation-863.webp'
import './hero.css'

// Keep in sync with the preload tag that scripts/prerender.mjs writes for the home page.
export const HERO_SIZES = '(max-width: 900px) 92vw, 520px'

export default function Hero() {
  return (
    <section className="hero">
      {/* Foreground Content (Text, CTAs, Stats, Image) */}
      <div className="hero-content">
        <div className="hero-blob one"></div>
        <div className="hero-blob two"></div>

        <div className="wrap hero-grid">
          <div>
            <span className="kicker">Full-service, one crew</span>
            <h1>Every trade your property needs, handled by <em>our team.</em></h1>
            <p className="lede">
              PrimeFix Solutions covers the complete range of building and property maintenance —
              carpentry, roofing, repairs, painting, and grounds work — so you're never juggling
              five different contractors for one property.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-primary" href="#contact">Get a free estimate</a>
              <a className="btn btn-outline" href="#portfolio">See our work</a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><b>15+ yrs</b><span>hands-on experience</span></div>
              <div className="hero-stat"><b>500+</b><span>properties maintained</span></div>
              <div className="hero-stat"><b>Licensed</b><span>&amp; fully insured</span></div>
            </div>
          </div>

          <div className="hero-image-wrap">
            <div className="hero-frame">
              <img
                src={heroLarge}
                srcSet={`${heroSmall} 480w, ${heroLarge} 863w`}
                sizes={HERO_SIZES}
                alt="Split view of the same room before and after renovation: worn bare floor and plain walls on the left, finished hardwood floor and painted walls and trim on the right"
                width="863"
                height="581"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
              <span className="hero-tag before" aria-hidden="true">Before</span>
              <span className="hero-tag after" aria-hidden="true">After</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
