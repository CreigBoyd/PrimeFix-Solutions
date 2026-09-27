import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { showToast } from '../utils/toast'

const CATEGORIES = [
  {
    id: 'electrical',
    title: 'Electrical handyman services',
    icon: '⚡',
    badge: 'Popular',
    description: 'Expert fixes for lighting, power, fans, and smart home upgrades.',
    tasks: [
      'Replace bathroom ventilation fan',
      'Installing ceiling fan',
      'Replacing a light fixture',
      'Changing smoke detector batteries',
      'Replace non-working outlets and plugs',
      'Changing light bulbs',
      'Replace fluorescent lights with LEDs',
      'Smart home automation',
      'Plus lots more! No job is too small'
    ]
  },
  {
    id: 'plumbing',
    title: 'Plumbing handyman services',
    icon: '🚰',
    badge: 'High Demand',
    description: 'Quick resolution for leaks, clogs, fixtures, and disposals.',
    tasks: [
      'Fixing clogged shower drain',
      'Replacing tub/shower faucet',
      'Fixing leaky faucet',
      'Installing a garbage disposal',
      'Repair or replace a toilet',
      'Fixing leaking outdoor spigot',
      'Fixing leaking shower head',
      'Plus lots more! No job is too small.'
    ]
  },
  {
    id: 'general',
    title: 'General home maintenance',
    icon: '🔧',
    badge: 'Essential',
    description: 'Keep your home running smoothly with routine checks and upkeep.',
    tasks: [
      'Minor appliance maintenance',
      'Replace HVAC air filter',
      'Replace smoke detector batteries',
      'Interior + exterior caulking',
      'First story gutter inspection',
      'Sump pump inspection',
      'Paint touch-ups',
      'Weatherstripping',
      'Deck and patio maintenance',
      'Power washing',
      'Child and pet safety checks'
    ]
  },
  {
    id: 'blinds',
    title: 'Blinds and window treatments',
    icon: '🪟',
    badge: 'Custom',
    description: 'Professional installation and adjustment for blinds, rods, and curtains.',
    tasks: [
      'Install curtain rods',
      'Install blinds',
      'Hang curtains',
      'Fitting blinds and curtains',
      'Lubricate tracks and rods',
      'Replace slats or panels',
      'Tighten and adjust hardware',
      'Dusting and wipe down'
    ]
  },
  {
    id: 'doors',
    title: 'Doors and windows',
    icon: '🚪',
    badge: 'Security',
    description: 'Hardware upgrades, frame repair, weatherstripping, and sealing.',
    tasks: [
      'Door and window frame repair',
      'Installation of new door hardware',
      'Door knob repair and replacement',
      'Weatherstripping replacement',
      'Caulking and sealing',
      'Hinge lubrication',
      'Lock replacement or repair',
      'Screen repair or replacement',
      'Pre-hung door installation'
    ]
  },
  {
    id: 'drywall',
    title: 'Drywall & Patching',
    icon: '🧱',
    badge: 'Finish',
    description: 'Seamless patching, crack repair, and texture matching.',
    tasks: [
      'Minor drywall repair',
      'Patching holes',
      'Fix sheetrock',
      'Seal and touch up cracks',
      'Apply textured finishes',
      'Fix ceiling drywall',
      'Fix and retape corner cracks',
      'Plus lots more! No job is too small.'
    ]
  },
  {
    id: 'tvs',
    title: 'TVs, artwork, and shelving',
    icon: '🖼️',
    badge: 'Mounting',
    description: 'Secure mounting for TVs, heavy mirrors, artwork, and custom shelving.',
    tasks: [
      'Mounting flatscreen TV',
      'Mounting picture frames',
      'Hanging artwork or paintings',
      'Hanging mirrors',
      'Installing shelves',
      'Mounting floating shelves',
      'Installing towel racks or bathroom accessories',
      'Mounting bike racks or storage hooks',
      'Mounting floating bookshelves',
      'Installing garage organization systems'
    ]
  },
  {
    id: 'furniture',
    title: 'Furniture assembly & repairs',
    icon: '🪑',
    badge: 'Assembly',
    description: 'Flat-pack assembly, wobbly chair fixes, and structural reinforcements.',
    tasks: [
      'Assembling flat-pack furniture',
      'Bedroom furniture assembly',
      'Office furniture assembly',
      'Outdoor furniture assembly',
      'Repairing loose or broken furniture joints',
      'Fixing wobbly chairs or tables',
      'Replacing broken drawer slides or cabinet hinges',
      'Repairing broken chair or table legs',
      'Replacing damaged or worn-out casters on furniture',
      'Anchoring furniture'
    ]
  },
  {
    id: 'smart',
    title: 'Smart home, Wi-Fi & EV chargers',
    icon: '📡',
    badge: 'Tech',
    description: 'Smart thermostats, cameras, locks, and robust wireless coverage.',
    tasks: [
      'Configuring smart plugs for appliances',
      'Setting up smart thermostats',
      'Installing smart doorbell systems',
      'Mounting and configuring smart security cameras',
      'Installing smart lighting systems',
      'Setting up smart locks for keyless entry',
      'Setting up voice-controlled assistants',
      'Configuring Wi-Fi routers',
      'Installing Wi-Fi range extenders'
    ]
  }
]

export default function ServiceExplorer() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTasks, setSelectedTasks] = useState([])
  const [activeTab, setActiveTab] = useState('explorer') // 'explorer' or 'calculator'
  
  // Calculator state
  const [calcQuantity, setCalcQuantity] = useState(3)
  
  const [estimateModalOpen, setEstimateModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [copiedNotification, setCopiedNotification] = useState(false)
  const [contactInfo, setContactInfo] = useState({ name: '', phone: '', email: '', notes: '' })

  const activeCategory = useMemo(() => {
    return CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0]
  }, [selectedCategory])

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return CATEGORIES
    const term = searchTerm.toLowerCase()
    return CATEGORIES.map(cat => ({
      ...cat,
      matchingTasks: cat.tasks.filter(t => t.toLowerCase().includes(term))
    })).filter(cat => cat.title.toLowerCase().includes(term) || cat.description.toLowerCase().includes(term) || cat.matchingTasks.length > 0)
  }, [searchTerm])

  const toggleTaskSelection = (task) => {
    setSelectedTasks(prev => {
      const isSelected = prev.includes(task)
      if (isSelected) {
        showToast(`Removed "${task}"`)
        return prev.filter(t => t !== task)
      } else {
        showToast(`Added "${task}" to estimate`)
        return [...prev, task]
      }
    })
  }

  const handleSelectAllCategory = (category) => {
    const allSelected = category.tasks.every(t => selectedTasks.includes(t))
    if (allSelected) {
      setSelectedTasks(prev => prev.filter(t => !category.tasks.includes(t)))
      showToast(`Deselected all in ${category.title}`)
    } else {
      setSelectedTasks(prev => Array.from(new Set([...prev, ...category.tasks])))
      showToast(`Selected all in ${category.title}`)
    }
  }

  const handleCopyChecklist = () => {
    if (!selectedTasks.length) return
    const text = `PrimeFix Solutions - Requested Services:\n` + selectedTasks.map(t => `• ${t}`).join('\n')
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedNotification(true)
        showToast('Checklist copied to clipboard!')
        setTimeout(() => setCopiedNotification(false), 2500)
      }).catch(() => {})
    }
  }

  // Estimate calculations
  const calcBasePrice = selectedTasks.length > 0 ? selectedTasks.length * 75 + 110 : calcQuantity * 85 + 95
  const lowEnd = Math.round(calcBasePrice * 0.9)
  const highEnd = Math.round(calcBasePrice * 1.2)

  const handleEstimateSubmit = async (e) => {
    e.preventDefault()
    if (!contactInfo.name || !contactInfo.phone) {
      alert('Please enter your name and phone number.')
      return
    }

    setSubmitting(true)
    try {
      const serviceTitle = activeTab === 'explorer' 
        ? `Service Explorer (${selectedTasks.length} task${selectedTasks.length === 1 ? '' : 's'})`
        : `Quick Estimator (${calcQuantity} task${calcQuantity === 1 ? '' : 's'})`

      const messageContent = [
        `Estimated Price Range: $${lowEnd.toLocaleString()} – $${highEnd.toLocaleString()}`,
        selectedTasks.length > 0 ? `Selected Tasks:\n${selectedTasks.map(t => `• ${t}`).join('\n')}` : null,
        contactInfo.notes ? `Additional Notes:\n${contactInfo.notes}` : null
      ].filter(Boolean).join('\n\n')

      const res = await fetch('/api/send-mail.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: contactInfo.name,
          phone: contactInfo.phone,
          email: contactInfo.email,
          service: serviceTitle,
          message: messageContent
        })
      })

      const contentType = res.headers.get('content-type') || ''
      
      if (!contentType.includes('application/json')) {
        const text = await res.text()
        console.error('Server returned non-JSON response:', text)
        alert('Server configuration error: The PHP backend did not return valid JSON. Check server console.')
        return
      }

      const data = await res.json()

      if (res.ok && data.ok) {
        setSubmitted(true)
      } else {
        alert(data.error || 'Failed to submit request. Please try calling or texting us directly.')
      }
    } catch (err) {
      console.error('Estimate submission error:', err)
      alert('Network connection error. Ensure your server environment is running PHP.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="se-container">
      <style>{`
        .se-container { padding: 40px 20px 80px; max-width: 1280px; margin: 0 auto; color: var(--text, #fff); min-height: 85vh; }
        .se-wrap { display: flex; flex-direction: column; gap: 32px; }
        
        .se-top-nav-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .se-home-link { display: inline-flex; align-items: center; gap: 8px; color: var(--text-soft, #94a3b8); text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: color 0.2s; }
        .se-home-link:hover { color: var(--teal, #128077); }

        .se-mode-switch { display: inline-flex; background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 30px; padding: 4px; }
        .se-mode-btn { padding: 8px 18px; border-radius: 20px; border: none; background: transparent; color: var(--text-soft, #94a3b8); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .se-mode-btn.active { background: var(--teal, #128077); color: #fff; }

        .se-header { text-align: center; max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; align-items: center; }
        .se-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(18, 128, 119, 0.15); color: var(--teal-bright, #2dd4bf); border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
        .se-pulse { width: 8px; height: 8px; background: var(--teal-bright, #2dd4bf); border-radius: 50%; box-shadow: 0 0 0 rgba(45, 212, 191, 0.4); animation: sePulse 2s infinite; }
        @keyframes sePulse { 0% { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0.4); } 70% { box-shadow: 0 0 0 8px rgba(45, 212, 191, 0); } 100% { box-shadow: 0 0 0 0 rgba(45, 212, 191, 0); } }
        .se-title { font-size: 2.4rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; }
        .se-subtitle { font-size: 1rem; color: var(--text-soft, #94a3b8); line-height: 1.55; }
        
        .se-search-box { position: relative; width: 100%; max-width: 600px; margin-top: 8px; display: flex; align-items: center; }
        .se-search-icon { position: absolute; left: 16px; font-size: 1.1rem; }
        .se-input { width: 100%; padding: 14px 48px 14px 48px; background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 12px; color: var(--text, #fff); font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
        .se-input:focus { border-color: var(--teal, #128077); }
        .se-clear-btn { position: absolute; right: 14px; background: none; border: none; color: var(--text-soft, #94a3b8); cursor: pointer; font-size: 0.85rem; font-weight: 600; }
        
        .se-category-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 8px; }
        @media(max-width: 900px) { .se-category-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 600px) { .se-category-grid { grid-template-columns: 1fr; } }

        .se-cat-card { background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 12px; cursor: pointer; transition: all 0.2s ease; position: relative; text-align: left; }
        .se-cat-card:hover { border-color: var(--teal, #128077); transform: translateY(-2px); }
        .se-cat-card.active { border-color: var(--teal-bright, #2dd4bf); background: rgba(18, 128, 119, 0.12); box-shadow: 0 8px 24px rgba(18, 128, 119, 0.15); }
        .se-cat-card-header { display: flex; justify-content: space-between; align-items: center; }
        .se-cat-icon { font-size: 1.6rem; }
        .se-cat-badge { font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 10px; background: rgba(255,255,255,0.08); color: var(--teal-bright, #2dd4bf); text-transform: uppercase; }
        .se-cat-title { font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0; }
        .se-cat-desc { font-size: 0.82rem; color: var(--text-soft, #94a3b8); line-height: 1.4; margin: 0; }

        .se-detail-panel { background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 16px; padding: 32px; display: flex; flex-direction: column; gap: 24px; }
        .se-detail-head { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; border-bottom: 1px solid var(--border, #20364d); padding-bottom: 20px; }
        .se-task-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
        .se-task-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--bg, #0a131c); border: 1px solid var(--border, #20364d); border-radius: 10px; cursor: pointer; transition: all 0.15s; }
        .se-task-item:hover { border-color: var(--teal, #128077); }
        .se-task-item.selected { border-color: var(--teal-bright, #2dd4bf); background: rgba(18, 128, 119, 0.18); }
        .se-task-checkbox { width: 18px; height: 18px; accent-color: var(--teal, #128077); cursor: pointer; }
        .se-task-label { font-size: 0.88rem; font-weight: 500; color: #fff; cursor: pointer; }

        .se-sticky-bar { position: sticky; bottom: 20px; z-index: 10; background: rgba(19, 34, 49, 0.95); backdrop-filter: blur(12px); border: 1px solid var(--teal, #128077); border-radius: 16px; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; box-shadow: 0 12px 32px rgba(0,0,0,0.4); margin-top: 24px; }
        .se-sticky-info { display: flex; flex-direction: column; gap: 2px; }
        .se-sticky-count { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--teal-bright, #2dd4bf); font-weight: 700; }
        .se-sticky-price { font-size: 1.3rem; font-weight: 800; color: #fff; }
        .se-sticky-actions { display: flex; gap: 12px; align-items: center; }

        .se-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .se-modal { background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 20px; padding: 36px; max-width: 550px; width: 100%; box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
      `}</style>

      <div className="se-wrap">
        {/* Top Navigation & Mode Switch */}
        <div className="se-top-nav-bar">
          <Link to="/" className="se-home-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to Home</span>
          </Link>

          <div className="se-mode-switch">
            <button
              type="button"
              className={`se-mode-btn ${activeTab === 'explorer' ? 'active' : ''}`}
              onClick={() => setActiveTab('explorer')}
            >
              Interactive Checklist
            </button>
            <button
              type="button"
              className={`se-mode-btn ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculator')}
            >
              Quick Estimator
            </button>
          </div>
        </div>

        {/* Section Header */}
        <div className="se-header">
          <div className="se-badge">
            <span className="se-pulse"></span>
            Comprehensive Service Catalog
          </div>
          <h1 className="se-title">Explore Services &amp; Build Your Checklist.</h1>
          <p className="se-subtitle">
            Select tasks across any trade to create a customized job checklist and view instant ballpark estimates.
          </p>

          {/* Search Box */}
          <div className="se-search-box">
            <span className="se-search-icon">🔍</span>
            <input
              type="text"
              className="se-input"
              placeholder="Search services (e.g. fan, outlet, faucet, mounting)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" className="se-clear-btn" onClick={() => setSearchTerm('')}>Clear</button>
            )}
          </div>
        </div>

        {activeTab === 'explorer' ? (
          <>
            {/* Category Cards Grid */}
            <div className="se-category-grid">
              {filteredCategories.map((cat) => {
                const isActive = selectedCategory === cat.id
                const categorySelectedCount = cat.tasks.filter(t => selectedTasks.includes(t)).length

                return (
                  <div
                    key={cat.id}
                    className={`se-cat-card ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <div className="se-cat-card-header">
                      <span className="se-cat-icon">{cat.icon}</span>
                      {categorySelectedCount > 0 ? (
                        <span className="se-cat-badge" style={{ background: 'var(--teal)', color: '#fff' }}>
                          {categorySelectedCount} selected
                        </span>
                      ) : (
                        <span className="se-cat-badge">{cat.badge}</span>
                      )}
                    </div>
                    <h3 className="se-cat-title">{cat.title}</h3>
                    <p className="se-cat-desc">{cat.description}</p>
                  </div>
                )
              })}
            </div>

            {/* Active Category Tasks Explorer */}
            {activeCategory && (
              <div className="se-detail-panel">
                <div className="se-detail-head">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.8rem' }}>{activeCategory.icon}</span>
                      <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{activeCategory.title}</h2>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-soft)', margin: 0 }}>{activeCategory.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectAllCategory(activeCategory)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg, #0a131c)',
                      color: 'var(--text)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {activeCategory.tasks.every(t => selectedTasks.includes(t)) ? 'Deselect All in Category' : 'Select All in Category'}
                  </button>
                </div>

                <div className="se-task-grid">
                  {activeCategory.tasks.map((task) => {
                    const isSelected = selectedTasks.includes(task)
                    return (
                      <div
                        key={task}
                        className={`se-task-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleTaskSelection(task)}
                      >
                        <input
                          type="checkbox"
                          className="se-task-checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                        />
                        <span className="se-task-label">{task}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sticky Checklist Summary Drawer */}
            {selectedTasks.length > 0 && (
              <div className="se-sticky-bar">
                <div className="se-sticky-info">
                  <span className="se-sticky-count">{selectedTasks.length} task{selectedTasks.length === 1 ? '' : 's'} selected in your checklist</span>
                  <div className="se-sticky-price">
                    Est. ${lowEnd.toLocaleString()} –${highEnd.toLocaleString()}
                  </div>
                </div>

                <div className="se-sticky-actions">
                  <button
                    type="button"
                    onClick={handleCopyChecklist}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      color: '#fff',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {copiedNotification ? '✓ Copied!' : 'Copy List'}
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setEstimateModalOpen(true)}
                    style={{ padding: '10px 20px', fontWeight: 700 }}
                  >
                    Request Free Quote ({selectedTasks.length})
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Quick Estimator Tab */
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '40px', maxWidth: '750px', margin: '0 auto', width: '100%' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Instant Task Quantity Calculator</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-soft)', marginBottom: '32px' }}>
              Slide to select the total number of small repairs or installations you need completed during a single visit.
            </p>

            <div style={{ background: 'var(--bg, #0a131c)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Total Tasks / Fixtures</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--teal-bright)' }}>{calcQuantity} item{calcQuantity === 1 ? '' : 's'}</span>
              </div>

              <input
                type="range"
                min="1"
                max="15"
                value={calcQuantity}
                onChange={(e) => setCalcQuantity(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--teal)', cursor: 'pointer', marginBottom: '8px' }}
              />
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(18,128,119,0.15), rgba(14,90,84,0.3))', border: '2px solid var(--teal)', borderRadius: '14px', padding: '28px', textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--teal-bright)', fontWeight: 700 }}>Combined Service Estimate</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', margin: '8px 0' }}>
                ${lowEnd.toLocaleString()} –${highEnd.toLocaleString()}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-soft)', margin: 0 }}>
                Includes standard trip, tools, and labor for {calcQuantity} handyman tasks.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setEstimateModalOpen(true)}
              style={{ width: '100%', padding: '14px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
            >
              Lock In This Estimate &amp; Schedule
            </button>
          </div>
        )}
      </div>

      {/* Quote Request Modal */}
      {estimateModalOpen && (
        <div className="se-modal-backdrop" onClick={() => setEstimateModalOpen(false)}>
          <div className="se-modal" onClick={(e) => e.stopPropagation()}>
            {!submitted ? (
              <form onSubmit={handleEstimateSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.3rem', margin: 0 }}>Request Your Free Quote</h3>
                  <button type="button" onClick={() => setEstimateModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>

                {selectedTasks.length > 0 && (
                  <div style={{ background: 'var(--bg, #0a131c)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', maxHeight: '120px', overflowY: 'auto' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--teal-bright)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>SELECTED TASKS ({selectedTasks.length}):</span>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-soft)' }}>
                      {selectedTasks.map(t => <li key={t}>{t}</li>)}
                    </ul>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Name *</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Email Address</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>Additional Notes (Optional)</label>
                    <textarea
                      placeholder="Any specific instructions or details..."
                      value={contactInfo.notes}
                      onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', height: '70px' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--teal-bright)', marginBottom: '12px' }}>Request Received! 🎉</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-soft)', lineHeight: 1.5, marginBottom: '20px' }}>
                  Thanks <strong>{contactInfo.name}</strong>! We have received your request. Our team will contact you at <strong>{contactInfo.phone}</strong> within 24 hours.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => { setEstimateModalOpen(false); setSubmitted(false); }}
                  style={{ padding: '10px 20px', cursor: 'pointer' }}
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}