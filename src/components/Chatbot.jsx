import { useState, useRef, useEffect } from 'react'

// Automated FAQ knowledge base with keyword matching
const FAQ_KNOWLEDGE_BASE = [
  {
    keywords: ['available', 'availability', 'schedule', 'when can', 'how soon', 'time'],
    answer: "Usually our technicians are available within 1 to 3 days. However, we do have an emergency on-call system for urgent issues that need immediate attention!",
    action: { label: "Request a Date", link: "#contact" }
  },
  {
    keywords: ['emergency', 'urgent', 'on call', 'after hours', 'leak', 'burst'],
    answer: "For emergency HVAC, plumbing, or roof leaks, our on-call crew responds immediately. You can reach emergency dispatch directly at (555) 019-2831.",
    action: { label: "Call Emergency Line", href: "tel:5550192831" }
  },
  {
    keywords: ['estimate', 'quote', 'cost', 'free', 'price', 'pricing', 'charge'],
    answer: "We provide 100% free, no-obligation written estimates. A technician will walk your property, inspect the scope, and give you a clear price before any work begins.",
    action: { label: "Get Free Estimate", link: "#contact" }
  },
  {
    keywords: ['service', 'do you do', 'hvac', 'roofing', 'plumbing', 'grounds', 'offer'],
    answer: "We offer comprehensive building maintenance including HVAC tuning, roof sealing & repairs, backflow/plumbing maintenance, and grounds drainage safety.",
    action: { label: "View Maintenance Plans", link: "/maintenance-plans" }
  },
  {
    keywords: ['location', 'area', 'where', 'city', 'town', 'serve'],
    answer: "We serve the entire local metro area and surrounding commercial/residential corridors within a 30-mile radius.",
  }
]

// Default quick questions displayed at startup
const QUICK_QUESTIONS = [
  "When can you be available?",
  "Do you give free estimates?",
  "How does emergency on-call work?",
  "What services do you cover?"
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi there! 👋 I'm the PrimeFix Assistant. How can we help with your property today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  const chatEndRef = useRef(null)

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isTyping])

  // Answer lookup logic
  const findAnswer = (query) => {
    const cleanQuery = query.toLowerCase()
    
    for (const faq of FAQ_KNOWLEDGE_BASE) {
      if (faq.keywords.some((kw) => cleanQuery.includes(kw))) {
        return {
          text: faq.answer,
          action: faq.action || null
        }
      }
    }

    return {
      text: "I'm not completely sure on that specific question, but our team can help! Would you like to send us a message or speak with our on-call tech directly?",
      action: { label: "Contact Us", link: "#contact" }
    }
  }

  // Handle user sending a message
  const handleSend = (textToSend) => {
    const query = textToSend || inputText.trim()
    if (!query) return

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: query, time: timeStr }
    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputText('')

    // Show bot typing indicator
    setIsTyping(true)

    setTimeout(() => {
      const match = findAnswer(query)
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: match.text,
        action: match.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 600)
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'sans-serif' }}>
      
      {/* --- CHAT WINDOW WIDGET --- */}
      {isOpen && (
        <div style={{
          width: '360px',
          height: '520px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 100px)',
          backgroundColor: '#0c1822',
          border: '1px solid rgba(23, 153, 141, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginBottom: '16px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #132735, #0a131c)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(23, 153, 141, 0.2)',
                border: '1px solid var(--teal-bright, #2dd4bf)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--teal-bright, #2dd4bf)'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>PrimeFix Assistant</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#2dd4bf' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2dd4bf', display: 'inline-block' }} />
                  Technicians On-Call
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Messages Stream */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'rgba(5, 12, 18, 0.6)'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%'
                }}
              >
                <div style={{
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  backgroundColor: msg.sender === 'user' ? '#17998D' : '#182836',
                  color: '#fff',
                  fontSize: '0.88rem',
                  lineHeight: '1.45',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {msg.text}

                  {/* Optional Action Button inside Bot Reply */}
                  {msg.action && (
                    <div style={{ marginTop: '10px' }}>
                      {msg.action.link ? (
                        <a
                          href={msg.action.link}
                          onClick={() => setIsOpen(false)}
                          style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            background: 'rgba(45, 212, 191, 0.15)',
                            border: '1px solid #2dd4bf',
                            borderRadius: '6px',
                            color: '#2dd4bf',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none'
                          }}
                        >
                          {msg.action.label} →
                        </a>
                      ) : (
                        <a
                          href={msg.action.href}
                          style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            background: '#2dd4bf',
                            borderRadius: '6px',
                            color: '#0a131c',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none'
                          }}
                        >
                          {msg.action.label} 📞
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '3px', display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                  {msg.time}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: '#182836', padding: '8px 14px', borderRadius: '12px', color: '#2dd4bf', fontSize: '0.8rem' }}>
                PrimeFix is typing...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Reply Suggestions */}
          <div style={{
            padding: '8px 12px',
            background: '#0d1d2b',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#cbd5e1',
                  fontSize: '0.74rem',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2dd4bf'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            style={{
              padding: '10px 12px',
              background: '#0a131c',
              display: 'flex',
              gap: '8px',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                background: '#132230',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#17998D',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      )}

      {/* --- FLOATING TOGGLE BUTTON --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open support chat"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #17998D, #0e625a)',
          border: '1px solid #2dd4bf',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(23, 153, 141, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s ease',
          marginLeft: 'auto'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>
    </div>
  )
}