import React from 'react';
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle';
import { SITE, telHref } from '../config/site'

const CATEGORIES = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h7l-1 8 11-14h-7l0-6z" />
      </svg>
    ),
  },
  {
    id: 'pricing',
    label: 'Pricing & Payment',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 15.5c0 1.1 1.1 2 2.5 2s2.5-.7 2.5-1.8c0-2.5-5-1.2-5-3.7 0-1.1 1.1-1.8 2.5-1.8s2.5.9 2.5 2M12 6.5v1M12 16.5v1" />
      </svg>
    ),
  },
  {
    id: 'scheduling',
    label: 'Scheduling & Visits',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    id: 'services',
    label: 'Services We Offer',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.8a5 5 0 01-6.8 6.8L5 21H3v-2L12.7 9.3a5 5 0 016.8-6.8l-3.8 3.8z" />
      </svg>
    ),
  },
  {
    id: 'trust',
    label: 'Trust & Guarantees',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
]

const FAQS = [
  {
    id: 'get-a-quote',
    category: 'getting-started',
    q: 'How do I get a quote?',
    a: 'Fill out the estimate form on our homepage, call or text us, or use the instant estimate tool on our Services page — whichever is easiest. Most quotes are turned around within 24 hours, often the same day.',
  },
  {
    id: 'free-estimate',
    category: 'getting-started',
    q: 'Is the estimate really free?',
    a: 'Yes — no cost, no obligation, and no credit card required. We\'ll look at the job (in person or over the phone, depending on scope) and give you a straight answer on price and timing before you decide anything.',
  },
  {
    id: 'service-area',
    category: 'getting-started',
    q: 'What areas do you service?',
    a: 'We cover the North Shore and surrounding communities. Not sure if you\'re in range? Use the zip code checker on our contact form, or just give us a call — we can often still help even just outside our usual radius.',
  },
  {
    id: 'be-home',
    category: 'getting-started',
    q: 'Do I need to be home during the visit?',
    a: 'Not necessarily. As long as we have access (a door code, lockbox, or someone 18+ on site) we can get the work done. If children under 18 are home, an adult does need to be present.',
  },
  {
    id: 'how-priced',
    category: 'pricing',
    q: 'How is pricing determined?',
    a: 'Every job is quoted individually based on scope, materials, and time — pay only for the work you actually need, with no subscription or membership required. Bigger jobs get a written estimate before we start; smaller tasks are typically priced by the hour.',
  },
  {
    id: 'deposit',
    category: 'pricing',
    q: 'Do you require a deposit?',
    a: 'For most standard repairs and maintenance, no. Larger projects involving special-order materials may require a deposit to cover those costs upfront — we\'ll always tell you clearly before any work begins.',
  },
  {
    id: 'payment-methods',
    category: 'pricing',
    q: 'What payment methods do you accept?',
    a: 'Cash, check, and all major credit cards. Payment is due on completion of the work unless we\'ve agreed on a different schedule for a larger project in advance.',
  },
  {
    id: 'hidden-fees',
    category: 'pricing',
    q: 'Are there any hidden fees?',
    a: 'No. The price we quote is the price you pay, barring any changes to the scope of work that we\'d always discuss with you first. No surprise trip charges, no vague "and up" pricing.',
  },
  {
    id: 'how-far-book',
    category: 'scheduling',
    q: 'How far in advance do I need to book?',
    a: 'For routine work, we can usually get to you within a few days to a week depending on the season. Spring and fall get busy fast, so if you\'ve got a project in mind, it\'s worth reaching out early.',
  },
  {
    id: 'reschedule',
    category: 'scheduling',
    q: 'What if I need to reschedule or cancel?',
    a: 'Life happens — just give us a call or text as early as you can. We ask for at least 24 hours\' notice when possible so we can offer that slot to another customer, but we\'ll always work with you on exceptions.',
  },
  {
    id: 'emergency',
    category: 'scheduling',
    q: 'Do you offer emergency or same-day service?',
    a: 'For urgent issues — an active leak, storm damage, a safety hazard — call us directly and we\'ll do everything we can to get someone out same-day. It may carry a modest rush fee depending on how the schedule is looking.',
  },
  {
    id: 'prepare-visit',
    category: 'scheduling',
    q: 'What should I do to prepare for a visit?',
    a: 'Just clear the work area of furniture, valuables, or anything you\'d rather we not have to work around. If pets are home, please keep them secured during the visit for everyone\'s comfort and safety.',
  },
  {
    id: 'what-jobs',
    category: 'services',
    q: 'What kinds of jobs do you actually handle?',
    a: (
      <>
        Carpentry, roofing, painting, yard and grounds work, seasonal upkeep, and general handyman repairs —
        basically the full range of building and property maintenance. Browse our{' '}
        <Link to="/services-explorer">full service explorer</Link> for the complete task list, or just ask —
        if it's not on there, there's a good chance we can still help.
      </>
    ),
  },
  {
    id: 'interior-exterior',
    category: 'services',
    q: 'Do you handle both interior and exterior work?',
    a: 'Yes, both. Drywall patches and interior painting on one visit, gutter cleaning and deck repair on the next — we don\'t split "inside" and "outside" work into different specialists like some companies do.',
  },
  {
    id: 'punch-list',
    category: 'services',
    q: 'Can you tackle a long list of small tasks in one visit?',
    a: 'That\'s exactly the kind of job we like best. Bundle your whole to-do list into one visit and one invoice instead of scheduling five different people for five small jobs.',
  },
  {
    id: 'seasonal-maintenance',
    category: 'services',
    q: 'Do you offer seasonal or recurring maintenance?',
    a: (
      <>
        Yes — take a look at our{' '}
        <Link to="/maintenance-plans">maintenance plans</Link> for the details on what's available and how it
        works.
      </>
    ),
  },
  {
    id: 'licensed-insured',
    category: 'trust',
    q: 'Are you licensed and insured?',
    a: 'Yes, fully licensed and insured — happy to provide documentation on request, and it\'s worth confirming with any contractor before they start work in your home.',
  },
  {
    id: 'not-happy',
    category: 'trust',
    q: "What if I'm not happy with the work?",
    a: 'Tell us right away. We\'ll come back and make it right — that\'s a standing commitment, not a fine-print policy. Most concerns get resolved same-week.',
  },
  {
    id: 'warranty',
    category: 'trust',
    q: 'Do you offer a warranty on repairs?',
    a: 'Workmanship on completed jobs is covered for 90 days — if something we fixed comes loose or fails on its own, we\'ll come back and correct it at no charge. Materials carry whatever warranty the manufacturer provides.',
  },
  {
    id: 'leave-review',
    category: 'trust',
    q: 'How do I leave a review?',
    a: (
      <>
        We'd genuinely love to hear how it went. Head over to our{' '}
        <Link to="/reviews">reviews page</Link> and click "Leave a review" — takes about a minute.
      </>
    ),
  },
]

export default function FAQ() {

// Sets the browser tab title to "Customer Reviews | PrimeFix Solutions"
  usePageTitle('FAQ', 'Answers about estimates, scheduling, licensing, pricing and how we work.');

  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [openIds, setOpenIds] = useState(() => new Set())

  const handleEstimateClick = (e) => {
    e.preventDefault()
    navigate('/')
    setTimeout(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const toggleOpen = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return FAQS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      if (!matchesCategory) return false
      if (!term) return true
      const haystack = item.q.toLowerCase() + ' ' + (typeof item.a === 'string' ? item.a.toLowerCase() : '')
      return haystack.includes(term)
    })
  }, [activeCategory, searchTerm])

  const grouped = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: filtered.filter((item) => item.category === cat.id),
    })).filter((cat) => cat.items.length > 0)
  }, [filtered])

  return (
    <>
      <section className="faq-hero">
        <div className="faq-hero-blob faq-hero-blob-a" />
        <div className="faq-hero-blob faq-hero-blob-b" />
        <div className="wrap faq-hero-inner">
          <span className="kicker">Questions, answered</span>
          <h1>Everything you'd want to know before booking.</h1>
          <p>Straight answers on pricing, scheduling, and what to expect — no fine print, no surprises.</p>

          <div className="faq-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search questions — pricing, scheduling, warranty…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search FAQs"
            />
            {searchTerm && (
              <button type="button" className="faq-search-clear" onClick={() => setSearchTerm('')} aria-label="Clear search">
                &times;
              </button>
            )}
          </div>

          <div className="faq-stats">
            <div><b>24hr</b><span>typical response</span></div>
            <div><b>90-day</b><span>workmanship guarantee</span></div>
            <div><b>Licensed</b><span>&amp; fully insured</span></div>
          </div>
        </div>
      </section>

      <section className="faq-body">
        <div className="wrap">
          <div className="faq-categories" role="tablist" aria-label="FAQ categories">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'all'}
              className={`faq-pill${activeCategory === 'all' ? ' active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All questions
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`faq-pill${activeCategory === cat.id ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="faq-pill-icon">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {grouped.length === 0 ? (
            <div className="faq-empty">
              <p>No questions match "{searchTerm}". Try a different search, or just ask us directly.</p>
              <a href={telHref} className="btn btn-outline">Call {SITE.phoneDisplay}</a>
            </div>
          ) : (
            grouped.map((cat) => (
              <div className="faq-group" key={cat.id}>
                <h2 className="faq-group-title">
                  <span className="faq-group-icon">{cat.icon}</span>
                  {cat.label}
                </h2>

                <div className="faq-list">
                  {cat.items.map((item) => {
                    const isOpen = openIds.has(item.id)
                    return (
                      <div className={`faq-item${isOpen ? ' open' : ''}`} key={item.id}>
                        <button
                          type="button"
                          className="faq-question"
                          aria-expanded={isOpen}
                          aria-controls={`faq-answer-${item.id}`}
                          onClick={() => toggleOpen(item.id)}
                        >
                          <span>{item.q}</span>
                          <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        <div className="faq-answer-wrap" id={`faq-answer-${item.id}`}>
                          <div className="faq-answer-inner">
                            <p>{item.a}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="faq-cta">
        <div className="wrap faq-cta-inner">
          <div>
            <h3>Still have a question?</h3>
            <p>We're happy to talk it through — no pressure, no sales pitch.</p>
          </div>
          <div className="faq-cta-actions">
            <a href={telHref} className="btn btn-outline">Call {SITE.phoneDisplay}</a>
            <a href="#contact" className="btn btn-primary" onClick={handleEstimateClick}>Get a free estimate</a>
          </div>
        </div>
      </section>
    </>
  )
}
