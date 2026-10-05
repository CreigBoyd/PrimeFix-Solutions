import heroImg from '../assets/primefix-hero.webp'
import heroPoster from '../assets/hero-poster.jpg'

export default function Hero() {
  return (
    <section className="hero">
      {/* Background Video Layer */}
      <video 
        className="hero-bg-video" 
        autoPlay 
        loop 
        muted 
        playsInline 
        poster={heroPoster}
      >
        <source src="/videos/bhero.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay Layer */}
      <div className="hero-bg-overlay"></div>

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
            <img
              src={heroImg}
              alt="PrimeFix Solutions technician holding a wrench and toolbox"
              width="470"
              height="960"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
}