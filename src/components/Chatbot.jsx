import React, { useState, useEffect, useRef } from 'react';

export default function LeadChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [step, setStep] = useState('GREETING'); // GREETING, SERVICE, ZIP, DETAILS, CONTACT, COMPLETE
  
  // Lead information state
  const [lead, setLead] = useState({
    service: '',
    zipCode: '',
    details: '',
    name: '',
    phone: ''
  });

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! Welcome to PrimeFix. I can help you get a quick quote or set up a call back from a technician."
    },
    {
      sender: 'bot',
      text: "What service do you need help with today?"
    }
  ]);

  const chatEndRef = useRef(null);

  // Auto-dismiss teaser bubble after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTeaser(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Handle preset service button clicks
  const handleSelectService = (serviceName) => {
    setLead((prev) => ({ ...prev, service: serviceName }));
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: serviceName },
      { sender: 'bot', text: `Got it, ${serviceName}. What is the zip code for the property?` }
    ]);
    setStep('ZIP');
  };

  // Handle user typing input
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    // Append user message
    const updatedMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(updatedMessages);

    // Process step transition
    if (step === 'ZIP') {
      setLead((prev) => ({ ...prev, zipCode: userText }));
      setStep('DETAILS');
      setMessages([
        ...updatedMessages,
        { sender: 'bot', text: 'Thanks! Can you briefly describe what work or repairs need to be done?' }
      ]);
    } else if (step === 'DETAILS') {
      setLead((prev) => ({ ...prev, details: userText }));
      setStep('CONTACT');
      setMessages([
        ...updatedMessages,
        { sender: 'bot', text: 'Almost done! What is your Full Name and the best Phone Number to reach you at?' }
      ]);
    } else if (step === 'CONTACT') {
      // Final step: parse name/phone and submit
      setLead((prev) => ({ ...prev, name: userText }));
      setStep('SUBMITTING');

      const finalLeadData = { ...lead, name: userText };

      // Background submission to Web3Forms / API
      submitLeadToEmail(finalLeadData);

      // Instant confirmation response shown to client
      setTimeout(() => {
        setStep('COMPLETE');
        setMessages([
          ...updatedMessages,
          {
            sender: 'bot',
            text: `✅ Request Received! Thank you, ${userText.split(' ')[0] || 'there'}. We have logged your project details.`
          },
          {
            sender: 'bot',
            text: `📞 A technician will review your request and call you back first thing tomorrow morning!`
          }
        ]);
      }, 600);
    }
  };

  // Background API submit (Web3Forms)
  const submitLeadToEmail = async (data) => {
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          subject: `Chatbot Lead: ${data.service} - ${data.name}`,
          from_name: 'Chatbot Intake Engine',
          ...data
        })
      });
    } catch (err) {
      console.error('Failed to dispatch chatbot lead notification', err);
    }
  };

  return (
    <div className="chatbot-wrapper" onContextMenu={(e) => e.stopPropagation()}>
      {/* Floating Teaser & Launcher Trigger */}
      {!isOpen && (
        <div className="chat-launcher-container" onContextMenu={(e) => e.stopPropagation()}>
          {/* Compact Auto-Dismissing Teaser Bubble */}
          {showTeaser && (
            <div 
              className="chat-teaser-bubble compact" 
              onClick={() => setIsOpen(true)}
              role="button"
              tabIndex={0}
            >
              <div className="teaser-content">
                <span className="teaser-badge">24/7 Response</span>
                <p className="teaser-text">⚡ Check technician availability & get instant quotes!</p>
              </div>
              <button 
                type="button"
                className="dismiss-teaser-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTeaser(false);
                }}
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

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window" onContextMenu={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="chat-header">
            <div className="chat-title">
              <span className="online-indicator"></span>
              <div>
                <h4>PrimeFix Assistant</h4>
                <p>24/7 Fast Response Bot</p>
              </div>
            </div>
            <button className="close-chat-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          {/* Messages Container */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {/* Service Quick-Select Buttons */}
            {step === 'GREETING' && (
              <div className="service-options">
                {['General Maintenance', 'Commercial Repair', 'Building Inspection', 'Emergency Repair'].map((svc) => (
                  <button key={svc} onClick={() => handleSelectService(svc)} className="service-chip-btn">
                    {svc}
                  </button>
                ))}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          {step !== 'COMPLETE' && (
            <form onSubmit={handleSend} className="chat-input-form">
              <input
                type="text"
                placeholder={
                  step === 'ZIP'
                    ? 'Enter property zip code...'
                    : step === 'DETAILS'
                    ? 'Describe your project...'
                    : step === 'CONTACT'
                    ? 'Your Name & Phone Number...'
                    : 'Type a message...'
                }
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <button type="submit" disabled={!inputVal.trim() && step !== 'GREETING'}>
                Send
              </button>
            </form>
          )}

          {/* Completion Footer */}
          {step === 'COMPLETE' && (
            <div className="chat-complete-footer">
              <p>Need immediate emergency help?</p>
              <a href="tel:5550000000" className="call-now-link">Call (555) 000-0000 Now</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}