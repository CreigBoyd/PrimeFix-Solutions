import { useState, useEffect, useRef } from 'react'
import { postJSON } from '../utils/api'
import { isValidPhone } from '../utils/validation'
import { SITE, telHref } from '../config/site'

const SERVICES = ['General Maintenance', 'Carpentry', 'Roofing', 'Painting & Finishing', 'Yard & Grounds', 'Emergency Repair']

const GREETING = [
  { sender: 'bot', text: 'Hi! Welcome to PrimeFix. I can help you request a quote or a call back from our team.' },
  { sender: 'bot', text: 'What service do you need help with today?' },
]

// Steps: SERVICE -> ZIP -> DETAILS -> NAME -> PHONE -> SUBMITTING -> COMPLETE | FAILED
const PROMPTS = {
  ZIP: 'What is the zip code for the property?',
  DETAILS: 'Thanks! Briefly describe the work or repairs that need to be done.',
  NAME: 'Almost done. What is your name?',
  PHONE: 'And the best phone number to reach you at?',
}

export default function LeadChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTeaser, setShowTeaser] = useState(true)
  const [step, setStep] = useState('SERVICE')
  const [lead, setLead] = useState({ service: '', zipCode: '', details: '', name: '', phone: '' })
  const [inputVal, setInputVal] = useState('')
  const [messages, setMessages] = useState(GREETING)
  const chatEndRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowTeaser(false), 6000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const say = (...bot) => bot.map((text) => ({ sender: 'bot', text }))

  const handleSelectService = (service) => {
    setLead((prev) => ({ ...prev, service }))
    setMessages((prev) => [...prev, { sender: 'user', text: service }, ...say(PROMPTS.ZIP)])
    setStep('ZIP')
  }

  const submitLead = async (finalLead) => {
    setStep('SUBMITTING')
    try {
      await postJSON('send-mail.php', {
        name: finalLead.name,
        phone: finalLead.phone,
        service: `Chatbot: ${finalLead.service}`,
        message: `Zip code: ${finalLead.zipCode}\n\n${finalLead.details}`,
      })
      setMessages((prev) => [
        ...prev,
        ...say(
          `Request received. Thank you, ${finalLead.name.split(' ')[0]}!`,
          'Our team will review the details and get back to you, usually within 24 hours.'
        ),
      ])
      setStep('COMPLETE')
    } catch (err) {
      // Never claim success when the request did not go through.
      setMessages((prev) => [
        ...prev,
        ...say(`Sorry, that didn't go through. ${err.message}`),
      ])
      setStep('FAILED')
    }
  }

  const handleSend = (e) => {
    e.preventDefault()
    const text = inputVal.trim()
    if (!text) return

    const withUser = [...messages, { sender: 'user', text }]

    if (step === 'ZIP') {
      if (!/^\d{5}(-\d{4})?$/.test(text)) {
        setMessages([...withUser, ...say('Please enter a valid 5-digit zip code.')])
        setInputVal('')
        return
      }
      setLead((prev) => ({ ...prev, zipCode: text }))
      setMessages([...withUser, ...say(PROMPTS.DETAILS)])
      setStep('DETAILS')
    } else if (step === 'DETAILS') {
      setLead((prev) => ({ ...prev, details: text }))
      setMessages([...withUser, ...say(PROMPTS.NAME)])
      setStep('NAME')
    } else if (step === 'NAME') {
      setLead((prev) => ({ ...prev, name: text }))
      setMessages([...withUser, ...say(PROMPTS.PHONE)])
      setStep('PHONE')
    } else if (step === 'PHONE') {
      if (!isValidPhone(text)) {
        setMessages([...withUser, ...say('That phone number looks too short. Please include the area code.')])
        setInputVal('')
        return
      }
      const finalLead = { ...lead, phone: text }
      setLead(finalLead)
      setMessages(withUser)
      submitLead(finalLead)
    }
    setInputVal('')
  }

  const placeholders = {
    ZIP: 'Property zip code…',
    DETAILS: 'Describe your project…',
    NAME: 'Your name…',
    PHONE: 'Your phone number…',
  }
  const showInput = placeholders[step] !== undefined

  return (
    <div className="chatbot-wrapper" onContextMenu={(e) => e.stopPropagation()}>
      {!isOpen && (
        <div className="chat-launcher-container" onContextMenu={(e) => e.stopPropagation()}>
          {showTeaser && (
            <div
              className="chat-teaser-bubble compact"
              onClick={() => setIsOpen(true)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(true)}
              role="button"
              tabIndex={0}
            >
              <div className="teaser-content">
                <span className="teaser-badge">Free Quotes</span>
                <p className="teaser-text">⚡ Get a quick estimate in under 2 minutes</p>
              </div>
              <button
                type="button"
                className="dismiss-teaser-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowTeaser(false)
                }}
                aria-label="Dismiss"
                title="Dismiss"
              >
                ×
              </button>
              <div className="teaser-arrow" />
            </div>
          )}

          <button className="chat-launcher-btn" onClick={() => setIsOpen(true)}>
            💬 Need an Estimate or Availability?
          </button>
        </div>
      )}

      {isOpen && (
        <div className="chat-window" role="dialog" aria-label="PrimeFix quote assistant" onContextMenu={(e) => e.stopPropagation()}>
          <div className="chat-header">
            <div className="chat-title">
              <span className="online-indicator"></span>
              <div>
                <h4>PrimeFix Assistant</h4>
                <p>Quick quote requests</p>
              </div>
            </div>
            <button className="close-chat-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">×</button>
          </div>

          <div className="chat-messages" aria-live="polite">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {step === 'SERVICE' && (
              <div className="service-options">
                {SERVICES.map((svc) => (
                  <button key={svc} onClick={() => handleSelectService(svc)} className="service-chip-btn">
                    {svc}
                  </button>
                ))}
              </div>
            )}

            {step === 'SUBMITTING' && <div className="chat-bubble bot">Sending…</div>}
            <div ref={chatEndRef} />
          </div>

          {showInput && (
            <form onSubmit={handleSend} className="chat-input-form">
              <input
                type={step === 'PHONE' ? 'tel' : 'text'}
                inputMode={step === 'ZIP' ? 'numeric' : undefined}
                placeholder={placeholders[step]}
                aria-label={placeholders[step]}
                value={inputVal}
                maxLength={step === 'DETAILS' ? 1000 : 100}
                onChange={(e) => setInputVal(e.target.value)}
                autoFocus
              />
              <button type="submit" disabled={!inputVal.trim()}>Send</button>
            </form>
          )}

          {(step === 'COMPLETE' || step === 'FAILED') && (
            <div className="chat-complete-footer">
              <p>{step === 'FAILED' ? 'Prefer to talk to someone now?' : 'Need immediate help?'}</p>
              <a href={telHref} className="call-now-link">Call {SITE.phoneDisplay}</a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
