import { useState, useRef } from 'react'

const PROJECTS = [
  {
    id: 1,
    title: 'Full Exterior Deck Rebuild & Railing Upgrade',
    category: 'Carpentry',
    desc: 'Replaced a severely weathered, rotting 20-year-old pine deck with low-maintenance composite decking and custom black aluminum railing.',
    beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Architectural Shingle Roof Replacement',
    category: 'Roofing',
    desc: 'Strips away old 3-tab shingles, repaired plywood roof decking, and installed heavy-duty architectural dimensional shingles with upgraded ridge vents.',
    beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Complete Kitchen & Interior Cabinet Refinishing',
    category: 'Painting & Finishing',
    desc: 'Sprayed dated oak cabinets with a clean modern satin finish, added new matte black hardware, and updated wall trim.',
    beforeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  },
]

function ComparisonSlider({ beforeImg, afterImg, title }) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current || !e.touches[0]) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsDragging(false)}
      onTouchCancel={() => setIsDragging(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: '420px',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'ew-resize',
        userSelect: 'none',
        boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
      }}
    >
      {/* After Image (Background) */}
      <img
        src={afterImg}
        alt={`${title} After`}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
      />
      <span style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(18, 128, 119, 0.85)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, zIndex: 2 }}>
        AFTER
      </span>

      {/* Before Image (Clipped) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          pointerEvents: 'none',
        }}
      >
        <img
          src={beforeImg}
          alt={`${title} Before`}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(20, 30, 45, 0.85)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, zIndex: 2 }}>
          BEFORE
        </span>
      </div>

      {/* Divider Line & Handle */}
      <div
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPosition}%`,
          width: '4px',
          background: '#2dd4bf',
          cursor: 'ew-resize',
          zIndex: 3,
          transform: 'translateX(-50%)',
          touchAction: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '36px',
            height: '36px',
            background: '#128077',
            border: '2px solid #fff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
        >
          ↔
        </div>
      </div>
    </div>
  )
}

export default function BeforeAfterPortfolio() {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', 'Carpentry', 'Roofing', 'Painting & Finishing']

  const filteredProjects = activeCategory === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeCategory)

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '100px', minHeight: '80vh', color: 'var(--text, #fff)' }}>
      <div className="wrap">
        <div className="section-head" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
          <span className="kicker">Interactive Project Portfolio</span>
          <h2>Drag to reveal the transformations.</h2>
          <p>See the dramatic difference professional craftsmanship makes. Slide back and forth across real project photos below.</p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                background: activeCategory === cat ? 'var(--teal)' : 'var(--bg-card, #132231)',
                color: activeCategory === cat ? '#fff' : 'var(--text-soft)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid with Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '900px', margin: '0 auto' }}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              style={{
                background: 'var(--bg-card, #132231)',
                border: '1px solid var(--border, #20364d)',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--teal-bright, #2dd4bf)', fontWeight: 700 }}>
                    {project.category}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', marginTop: '4px' }}>{project.title}</h3>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-soft, #94a3b8)', marginBottom: '20px', lineHeight: 1.5 }}>
                {project.desc}
              </p>

              <ComparisonSlider
                beforeImg={project.beforeImg}
                afterImg={project.afterImg}
                title={project.title}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}