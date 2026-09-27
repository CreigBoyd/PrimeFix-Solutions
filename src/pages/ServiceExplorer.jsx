import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

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
      'Replace florescent lights with LEDs',
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
  const [calcServiceType, setCalcServiceType] = useState('Electrical & Fixtures')
  const [calcQuantity, setCalcQuantity] = useState(3)
  
  const [estimateModalOpen, setEstimateModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [copiedNotification, setCopiedNotification] = useState(false)

  const activeCategory = useMemo(() => {
    return CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0]
  }, [selectedCategory])

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return CATEGORIES
    const term = searchTerm.toLowerCase()
    return CATEGORIES.map(cat => ({
      ...cat,
      matchingTasks: cat.tasks.filter(t => t.toLowerCase().includes(term))
    })).filter(cat => cat.title.toLowerCase().includes(term) || cat.matchingTasks.length > 0)
  }, [searchTerm])

  const toggleTaskSelection = (task) => {
    setSelectedTasks(prev => 
      prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
    )
  }

  const handleSelectAllCategory = (cat) => {
    const tasks = cat.tasks
    const allSelected = tasks.every(t => selectedTasks.includes(t))
    if (allSelected) {
      setSelectedTasks(prev => prev.filter(t => !tasks.includes(t)))
    } else {
      const newTasks = [...selectedTasks]
      tasks.forEach(t => {
        if (!newTasks.includes(t)) newTasks.push(t)
      })
      setSelectedTasks(newTasks)
    }
  }

  // Quick Calculator Math
  const calcBasePrice = selectedTasks.length > 0 ? selectedTasks.length * 75 + 120 : calcQuantity * 90 + 100
  const lowEnd = Math.round(calcBasePrice * 0.9)
  const highEnd = Math.round(calcBasePrice * 1.25)

  return (
    <div className="se-container">
      <style>{`
        .se-container { padding: 40px 20px 60px; max-width: 1280px; margin: 0 auto; color: var(--text, #fff); }
        .se-wrap { display: flex; flex-direction: column; gap: 32px; }
        
        .se-top-nav-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .se-home-link { display: inline-flex; align-items: center; gap: 8px; color: var(--text-soft, #94a3b8); text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: color 0.2s; }
        .se-home-link:hover { color: var(--teal, #128077); }

        .se-mode-switch { display: inline-flex; background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 30px; padding: 4px; }
        .se-mode-btn { padding: 8px 18px; border-radius: 20px; border: none; background: transparent; color: var(--text-soft, #94a3b8); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .se-mode-btn.active { background: var(--teal, #128077); color: #fff; }

        .se-header { text-align: center; max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; align-items: center; }
        .se-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(18, 128, 119, 0.15); color: var(--teal, #128077); border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
        .se-pulse { width: 8px; height: 8px; background: var(--teal, #128077); border-radius: 50%; box-shadow: 0 0 0 rgba(18, 128, 119, 0.4); animation: sePulse 2s infinite; }
        @keyframes sePulse { 0% { box-shadow: 0 0 0 0 rgba(18, 128, 119, 0.4); } 70% { box-shadow: 0 0 0 8px rgba(18, 128, 119, 0); } 100% { box-shadow: 0 0 0 0 rgba(18, 128, 119, 0); } }
        .se-title { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; }
        .se-subtitle { font-size: 1rem; color: var(--text-soft, #94a3b8); line-height: 1.5; }
        
        .se-search-box { position: relative; width: 100%; max-width: 600px; margin-top: 8px; display: flex; align-items: center; }
        .se-search-icon { position: absolute; left: 16px; font-size: 1.1rem; }
        .se-input { width: 100%; padding: 14px 48px 14px 48px; background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 12px; color: var(--text, #fff); font-size: 0.95rem; outline: none; transition: border-color 0.2s; }
        .se-input:focus { border-color: var(--teal, #128077); }
        .se-clear-btn { position: absolute; right: 14px; background: none; border: none; color: var(--text-soft, #94a3b8); cursor: pointer; font-size: 0.85rem; font-weight: 600; }
        
        /* Category Cards Grid replacing the old pills */
        .se-category-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 8px; }
        @media(max-width: 900px) { .se-category-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 600px) { .se-category-grid { grid-template-columns: 1fr; } }

        .se-cat-card { background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 12px; cursor: pointer; text-align: left; transition: all 0.2s ease; position: relative; }
        .se-cat-card:hover { border-color: var(--teal, #128077); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
        .se-cat-card.active { background: rgba(18, 128, 119, 0.12); border-color: var(--teal, #128077); }
        .se-cat-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .se-cat-icon { font-size: 2rem; background: rgba(18, 128, 119, 0.1); padding: 8px 12px; border-radius: 10px; }
        .se-cat-title { font-size: 1.05rem; font-weight: 700; color: var(--text, #fff); line-height: 1.3; }
        .se-cat-desc { font-size: 0.82rem; color: var(--text-soft, #94a3b8); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .se-cat-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); font-size: 0.78rem; color: var(--text-soft, #94a3b8); }
        .se-cat-count-badge { background: var(--teal, #128077); color: #fff; padding: 2px 8px; border-radius: 10px; font-weight: 600; font-size: 0.75rem; }

        .se-main-layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }
        @media(max-width: 900px) { .se-main-layout { grid-template-columns: 1fr; } }
        
        .se-sidebar { background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
        .se-sidebar-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; font-size: 0.85rem; font-weight: 600; color: var(--text-soft, #94a3b8); border-bottom: 1px solid var(--border, #20364d); margin-bottom: 6px; }
        .se-count-tag { background: rgba(18, 128, 119, 0.15); color: var(--teal, #128077); padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; }
        .se-sidebar-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: transparent; border: 1px solid transparent; border-radius: 10px; color: var(--text, #fff); cursor: pointer; text-align: left; transition: all 0.2s; }
        .se-sidebar-item:hover { background: rgba(255,255,255,0.03); }
        .se-sidebar-item.active { background: rgba(18, 128, 119, 0.15); border-color: var(--teal, #128077); }
        .se-sidebar-item-left { display: flex; align-items: center; gap: 12px; }
        .se-sidebar-icon { font-size: 1.2rem; }
        .se-sidebar-name { display: block; font-weight: 600; font-size: 0.9rem; }
        .se-sidebar-sub { display: block; font-size: 0.75rem; color: var(--text-soft, #94a3b8); }
        .se-arrow { color: var(--text-soft, #94a3b8); font-size: 0.9rem; }
        .se-badge-count { background: var(--teal, #128077); color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }

        .se-content-panel { background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 16px; padding: 32px; display: flex; flex-direction: column; gap: 24px; }
        .se-panel-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 1px solid var(--border, #20364d); padding-bottom: 24px; }
        @media(max-width: 600px) { .se-panel-top { flex-direction: column; } }
        .se-panel-heading { display: flex; gap: 16px; align-items: flex-start; }
        .se-panel-icon { font-size: 2.5rem; background: rgba(18, 128, 119, 0.1); padding: 12px; border-radius: 12px; }
        .se-badge-tag { display: inline-block; padding: 4px 10px; background: rgba(18, 128, 119, 0.15); color: var(--teal, #128077); border-radius: 6px; font-size: 0.75rem; font-weight: 600; margin-bottom: 6px; }
        .se-panel-heading h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 4px; }
        .se-panel-heading p { font-size: 0.9rem; color: var(--text-soft, #94a3b8); }
        
        .se-select-all-btn { padding: 8px 14px; background: transparent; border: 1px solid var(--border, #20364d); border-radius: 8px; color: var(--text, #fff); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .se-select-all-btn:hover { border-color: var(--teal, #128077); background: rgba(18, 128, 119, 0.1); }

        .se-panel-tasks-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media(max-width: 600px) { .se-panel-tasks-grid { grid-template-columns: 1fr; } }
        
        .se-task-card-btn { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: rgba(255,255,255,0.02); border: 1px solid var(--border, #20364d); border-radius: 10px; color: var(--text, #fff); text-align: left; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
        .se-task-card-btn:hover { border-color: var(--teal, #128077); background: rgba(18, 128, 119, 0.05); }
        .se-task-card-btn.selected { background: rgba(18, 128, 119, 0.15); border-color: var(--teal, #128077); }
        .se-task-checkbox { width: 22px; height: 22px; border: 1px solid var(--border, #20364d); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; background: rgba(0,0,0,0.1); }
        .se-task-checkbox.checked { background: var(--teal, #128077); border-color: var(--teal, #128077); color: #fff; font-weight: bold; }

        .se-callout { display: flex; justify-content: space-between; align-items: center; background: rgba(18, 128, 119, 0.08); border: 1px solid rgba(18, 128, 119, 0.3); border-radius: 12px; padding: 20px; margin-top: 12px; }
        @media(max-width: 600px) { .se-callout { flex-direction: column; gap: 16px; align-items: stretch; text-align: center; } }
        .se-callout-sub { font-size: 0.85rem; color: var(--text-soft, #94a3b8); margin-bottom: 2px; }
        .se-callout-main { font-size: 1rem; font-weight: 600; }
        .se-callout-main a { color: var(--teal, #128077); text-decoration: none; }

        .se-btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 24px; background: var(--teal, #128077); color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 0.95rem; transition: opacity 0.2s; }
        .se-btn-primary:hover { opacity: 0.9; }
        .se-count-pill { background: rgba(0,0,0,0.2); padding: 2px 8px; border-radius: 20px; font-size: 0.8rem; }

        .se-floating-bar { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: calc(100% - 40px); max-width: 800px; background: #0b1722; border: 1px solid var(--teal, #128077); border-radius: 16px; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 100; animation: seSlideUp 0.3s ease; }
        @keyframes seSlideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        .se-floating-info { display: flex; align-items: center; gap: 16px; overflow: hidden; }
        .se-floating-count { background: var(--teal, #128077); color: #fff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .se-floating-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 2px; }
        .se-floating-desc { font-size: 0.8rem; color: var(--text-soft, #94a3b8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 350px; }
        .se-floating-actions { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
        .se-link-btn { background: none; border: none; color: var(--text-soft, #94a3b8); cursor: pointer; font-size: 0.85rem; font-weight: 600; text-decoration: underline; }
        .se-link-btn:hover { color: var(--text, #fff); }

        .se-calculator-wrapper { background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 20px; padding: 40px; max-width: 850px; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }

        .se-search-results-section { display: flex; flex-direction: column; gap: 24px; }
        .se-results-header { display: flex; justify-content: space-between; align-items: center; }
        .se-grid-results { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .se-card { background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .se-card-header { display: flex; gap: 12px; align-items: flex-start; }
        .se-card-icon { font-size: 1.8rem; background: rgba(18, 128, 119, 0.1); padding: 8px; border-radius: 10px; }
        .se-card-desc { font-size: 0.85rem; color: var(--text-soft, #94a3b8); }
        .se-task-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .se-task-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: rgba(255,255,255,0.02); border: 1px solid var(--border, #20364d); border-radius: 8px; color: var(--text, #fff); font-size: 0.85rem; cursor: pointer; text-align: left; }
        .se-task-btn.selected { background: rgba(18, 128, 119, 0.15); border-color: var(--teal, #128077); }

        .se-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 1000; }
        .se-modal-box { background: var(--bg-card, #132231); border: 1px solid var(--border, #20364d); border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: 32px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .se-modal-close { position: absolute; top: 20px; right: 20px; background: none; border: none; color: var(--text-soft, #94a3b8); font-size: 1.2rem; cursor: pointer; }
        .se-modal-header { margin-bottom: 24px; }
        .se-modal-header h3 { font-size: 1.5rem; font-weight: 700; margin: 6px 0 4px 0; }
        .se-modal-header p { font-size: 0.9rem; color: var(--text-soft, #94a3b8); }
        
        .se-modal-task-box { background: rgba(0,0,0,0.2); border: 1px solid var(--border, #20364d); border-radius: 12px; padding: 16px; margin-bottom: 24px; }
        .se-modal-task-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.9rem; font-weight: 600; }
        .se-link-danger { background: none; border: none; color: #ef4444; font-size: 0.8rem; cursor: pointer; }
        .se-modal-list { list-style: none; padding: 0; margin: 0; max-height: 150px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
        .se-modal-list-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 6px; font-size: 0.85rem; }
        .se-remove-item { background: none; border: none; color: var(--text-soft, #94a3b8); cursor: pointer; font-size: 0.8rem; }
        .se-remove-item:hover { color: #ef4444; }

        .se-form { display: flex; flex-direction: column; gap: 16px; }
        .se-form-group { display: flex; flex-direction: column; gap: 6px; }
        .se-form-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-soft, #94a3b8); }
        .se-form-input, .se-form-textarea { width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.2); border: 1px solid var(--border, #20364d); border-radius: 10px; color: var(--text, #fff); font-size: 0.9rem; outline: none; }
        .se-form-input:focus, .se-form-textarea:focus { border-color: var(--teal, #128077); }
        .se-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media(max-width: 500px) { .se-form-row { grid-template-columns: 1fr; } }
        .se-honeypot { display: none; }
        .se-submit-btn { width: 100%; margin-top: 8px; }

        .se-submitted-state { text-align: center; padding: 32px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .se-success-icon { width: 64px; height: 64px; background: rgba(18, 128, 119, 0.2); color: var(--teal, #128077); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; }
        .se-submitted-state h3 { font-size: 1.5rem; font-weight: 700; }
        .se-submitted-state p { font-size: 0.95rem; color: var(--text-soft, #94a3b8); max-width: 400px; line-height: 1.5; }
        .se-modal-buttons { display: flex; gap: 12px; margin-top: 16px; }
        .se-btn-secondary { padding: 12px 20px; background: transparent; border: 1px solid var(--border, #20364d); border-radius: 10px; color: var(--text, #fff); font-weight: 600; cursor: pointer; font-size: 0.9rem; }
        .se-btn-secondary:hover { border-color: var(--teal, #128077); }

        .se-footer { margin-top: 80px; padding-top: 40px; border-top: 1px solid var(--border, #20364d); text-align: center; color: var(--text-soft, #94a3b8); font-size: 0.85rem; display: flex; flex-direction: column; gap: 12px; align-items: center; }
      `}</style>

      <div className="se-wrap">
        
        {/* Top Nav Bar with Back Link & View Mode Switcher */}
        <div className="se-top-nav-bar">
          <Link to="/" className="se-home-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to Home</span>
          </Link>

          {/* Mode Switcher Tabs */}
          <div className="se-mode-switch">
            <button
              onClick={() => setActiveTab('explorer')}
              className={`se-mode-btn ${activeTab === 'explorer' ? 'active' : ''}`}
            >
              🛠️ Service Explorer
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`se-mode-btn ${activeTab === 'calculator' ? 'active' : ''}`}
            >
              💵 Instant Cost Estimator {selectedTasks.length > 0 && `(${selectedTasks.length})`}
            </button>
          </div>
        </div>

        {activeTab === 'explorer' ? (
          <>
            {/* Header Section */}
            <div className="se-header">
              <div className="se-badge">
                <span className="se-pulse"></span>
                Professional Home Services Explorer
              </div>
              <h1 className="se-title">What needs fixing around your home?</h1>
              <p className="se-subtitle">
                Browse through our professional handyman services or search instantly. Select any category below or search to build a custom estimate in seconds.
              </p>

              {/* Search Box */}
              <div className="se-search-box">
                <span className="se-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search e.g. ceiling fan, drywall patch, leaking faucet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="se-input"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="se-clear-btn">
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Category Cards Grid replacing the old top scrollable pills */}
            {!searchTerm && (
              <div className="se-category-grid">
                {CATEGORIES.map(cat => {
                  const isActive = selectedCategory === cat.id
                  const countSelectedInCat = cat.tasks.filter(t => selectedTasks.includes(t)).length
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id)
                        // Smoothly scroll down or let user focus on the main layout panel below
                      }}
                      className={`se-cat-card ${isActive ? 'active' : ''}`}
                    >
                      <div className="se-cat-card-top">
                        <span className="se-cat-icon">{cat.icon}</span>
                        {countSelectedInCat > 0 ? (
                          <span className="se-cat-count-badge">{countSelectedInCat} selected</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>{cat.badge}</span>
                        )}
                      </div>
                      <div>
                        <div className="se-cat-title">{cat.title}</div>
                        <div className="se-cat-desc">{cat.description}</div>
                      </div>
                      <div className="se-cat-footer">
                        <span>{cat.tasks.length} specific tasks</span>
                        <span style={{ fontWeight: 600, color: isActive ? 'var(--teal-bright)' : 'inherit' }}>{isActive ? 'Viewing below ↓' : 'Select →'}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Conditional Search Grid vs Sidebar Layout */}
            {searchTerm ? (
              <div className="se-search-results-section">
                <div className="se-results-header">
                  <h2>Search Results for "{searchTerm}"</h2>
                  <button onClick={() => setSearchTerm('')} className="se-link-btn">
                    Reset search & view categories
                  </button>
                </div>

                {filteredCategories.length === 0 ? (
                  <div className="se-empty-state" style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ fontSize: '2rem' }}>🔍</p>
                    <h3>No matching services found</h3>
                    <p style={{ color: 'var(--text-soft)', margin: '8px 0 16px' }}>Try searching for a different keyword or browse our main categories.</p>
                    <button onClick={() => setSearchTerm('')} className="se-btn-primary">
                      View All Categories
                    </button>
                  </div>
                ) : (
                  <div className="se-grid-results">
                    {filteredCategories.map(cat => {
                      const tasksToShow = cat.matchingTasks || cat.tasks
                      return (
                        <div key={cat.id} className="se-card">
                          <div className="se-card-header">
                            <span className="se-card-icon">{cat.icon}</span>
                            <div>
                              <h3>{cat.title}</h3>
                              <span className="se-badge-tag">{cat.badge}</span>
                            </div>
                          </div>
                          <p className="se-card-desc">{cat.description}</p>
                          <ul className="se-task-list">
                            {tasksToShow.map((task, idx) => {
                              const isSelected = selectedTasks.includes(task)
                              return (
                                <li key={idx}>
                                  <button
                                    onClick={() => toggleTaskSelection(task)}
                                    className={`se-task-btn ${isSelected ? 'selected' : ''}`}
                                  >
                                    <span>{task}</span>
                                    <span className={`se-task-checkbox ${isSelected ? 'checked' : ''}`}>
                                      {isSelected ? '✓' : '+'}
                                    </span>
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="se-main-layout">
                
                {/* Sidebar list */}
                <div className="se-sidebar">
                  <div className="se-sidebar-header">
                    <span>Quick Jump Category</span>
                    <span className="se-count-tag">{CATEGORIES.length} Available</span>
                  </div>
                  {CATEGORIES.map(cat => {
                    const isSelected = selectedCategory === cat.id
                    const selectedInCat = cat.tasks.filter(t => selectedTasks.includes(t)).length
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`se-sidebar-item ${isSelected ? 'active' : ''}`}
                      >
                        <div className="se-sidebar-item-left">
                          <span className="se-sidebar-icon">{cat.icon}</span>
                          <div>
                            <span className="se-sidebar-name">{cat.title}</span>
                            <span className="se-sidebar-sub">{cat.tasks.length} tasks included</span>
                          </div>
                        </div>
                        {selectedInCat > 0 ? (
                          <span className="se-badge-count">{selectedInCat}</span>
                        ) : (
                          <span className="se-arrow">→</span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Main Active Category Display */}
                <div className="se-content-panel">
                  <div className="se-panel-top">
                    <div className="se-panel-heading">
                      <span className="se-panel-icon">{activeCategory.icon}</span>
                      <div>
                        <span className="se-badge-tag">{activeCategory.badge}</span>
                        <h2>{activeCategory.title}</h2>
                        <p>{activeCategory.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectAllCategory(activeCategory)}
                      className="se-select-all-btn"
                    >
                      {activeCategory.tasks.every(t => selectedTasks.includes(t)) ? 'Deselect All' : 'Select All in Category'}
                    </button>
                  </div>

                  <div className="se-panel-tasks-grid">
                    {activeCategory.tasks.map((task, idx) => {
                      const isSelected = selectedTasks.includes(task)
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleTaskSelection(task)}
                          className={`se-task-card-btn ${isSelected ? 'selected' : ''}`}
                        >
                          <span>{task}</span>
                          <span className={`se-task-checkbox ${isSelected ? 'checked' : ''}`}>
                            {isSelected ? '✓' : '+'}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Bottom Callout */}
                  <div className="se-callout">
                    <div>
                      <p className="se-callout-sub">Ready to calculate pricing for your tasks?</p>
                      <p className="se-callout-main">
                        You have <strong style={{ color: 'var(--teal-bright)' }}>{selectedTasks.length} tasks</strong> selected.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('calculator')}
                      className="se-btn-primary"
                    >
                      <span>Open Cost Calculator</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

              </div>
            )}
          </>
        ) : (
          /* Calculator Tab View */
          <div className="se-calculator-wrapper">
            <div className="section-head" style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span className="kicker">Instant Project Estimator</span>
              <h2>Your custom ballpark estimate range.</h2>
              <p>Calculated dynamically from the handyman tasks you selected in the explorer.</p>
            </div>

            {selectedTasks.length > 0 ? (
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--teal-bright)' }}>Selected Tasks Included in Estimate ({selectedTasks.length}):</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: 'var(--text-soft)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedTasks.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            ) : (
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-soft)', textAlign: 'center' }}>
                  No tasks selected yet. Use the slider below or <button onClick={() => setActiveTab('explorer')} style={{ background: 'none', border: 'none', color: 'var(--teal-bright)', cursor: 'pointer', textDecoration: 'underline' }}>go back to select tasks</button>.
                </p>
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Estimated Hours / Scope of Work: {calcQuantity} hrs</label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--teal)' }}
                  />
                </div>
              </div>
            )}

            {/* Live Price Box */}
            <div style={{ background: 'linear-gradient(135deg, rgba(18,128,119,0.15), rgba(14,90,84,0.3))', border: '2px solid var(--teal)', borderRadius: '14px', padding: '28px', textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--teal-bright)', fontWeight: 700 }}>Estimated Investment Range</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', margin: '8px 0' }}>
                ${lowEnd.toLocaleString()} –${highEnd.toLocaleString()}
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-soft)', maxWidth: '500px', margin: '0 auto' }}>
                *Includes professional labor, standard hardware, and our satisfaction guarantee. Final on-site quotes are always free.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setEstimateModalOpen(true)}
                className="se-btn-primary"
                style={{ padding: '14px 32px', fontSize: '1rem', fontWeight: 700 }}
              >
                Lock In This Estimate &amp; Request Free Quote →
              </button>
            </div>
          </div>
        )}

        {/* Floating Bottom Bar */}
        {selectedTasks.length > 0 && activeTab === 'explorer' && (
          <div className="se-floating-bar">
            <div className="se-floating-info">
              <span className="se-floating-count">{selectedTasks.length}</span>
              <div>
                <p className="se-floating-title">Tasks added to your estimate</p>
                <p className="se-floating-desc">{selectedTasks.join(', ')}</p>
              </div>
            </div>
            <div className="se-floating-actions">
              <button onClick={() => setSelectedTasks([])} className="se-link-btn">
                Clear all
              </button>
              <button onClick={() => setActiveTab('calculator')} className="se-btn-primary">
                <span>Calculate Cost ($)</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Estimate Modal */}
        {estimateModalOpen && (
          <div className="se-modal-backdrop">
            <div className="se-modal-box">
              <button 
                onClick={() => setEstimateModalOpen(false)}
                className="se-modal-close"
              >
                ✕
              </button>

              {submitted ? (
                <div className="se-submitted-state">
                  <div className="se-success-icon">✓</div>
                  <h3>Estimate Request Submitted!</h3>
                  <p>
                    We've received your list of <strong>{selectedTasks.length || calcQuantity + ' hrs of'} tasks</strong>. Our team will review your project and get back to you with a transparent quote within 24 hours.
                  </p>
                  <div className="se-modal-buttons">
                    <button
                      onClick={() => {
                        const textSummary = `PrimeFix Estimate Request:\n- ` + (selectedTasks.length > 0 ? selectedTasks.join('\n- ') : `${calcQuantity} hours of handyman work`);
                        navigator.clipboard.writeText(textSummary);
                        setCopiedNotification(true);
                        setTimeout(() => setCopiedNotification(false), 3000);
                      }}
                      className="se-btn-secondary"
                    >
                      {copiedNotification ? '✓ Copied Summary!' : '📋 Copy Task List'}
                    </button>
                    <button
                      onClick={() => {
                        setSubmitted(false)
                        setSelectedTasks([])
                        setEstimateModalOpen(false)
                        setActiveTab('explorer')
                      }}
                      className="se-btn-primary"
                    >
                      Done & Close
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="se-modal-header">
                    <span className="se-badge-tag">Secure Quote Request</span>
                    <h3>Request Your Free Estimate</h3>
                    <p>Review your estimated range (${lowEnd.toLocaleString()} –${highEnd.toLocaleString()}) and enter your contact details.</p>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault()
                      setSubmitted(true)
                    }}
                    className="se-form"
                  >
                    <div className="se-form-group">
                      <label>Your Full Name *</label>
                      <input required type="text" placeholder="e.g., Sarah Jenkins" className="se-form-input" />
                    </div>
                    <div className="se-form-row">
                      <div className="se-form-group">
                        <label>Phone Number *</label>
                        <input required type="tel" placeholder="(555) 000-0000" className="se-form-input" />
                      </div>
                      <div className="se-form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="sarah@example.com" className="se-form-input" />
                      </div>
                    </div>
                    <div className="se-form-group">
                      <label>Project Details or Preferred Timing</label>
                      <textarea rows="3" placeholder="Let us know any specific details about your home repair needs..." className="se-form-textarea"></textarea>
                    </div>

                    <input type="text" name="company_website" className="se-honeypot" tabIndex="-1" autoComplete="off" />

                    <button type="submit" className="se-btn-primary se-submit-btn">
                      <span>Submit Estimate Request</span>
                      <span>→</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}