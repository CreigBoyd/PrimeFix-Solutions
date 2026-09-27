import React, { useState } from 'react';

export default function JellyButton({ 
  children = "Click me", 
  onClick, 
  className = "",
  href
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    if (!isAnimating) {
      setIsAnimating(true);
      // Matches the CSS keyframe duration (600ms)
      setTimeout(() => setIsAnimating(false), 600);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const Component = href ? 'a' : 'button';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

        @keyframes jelly-bounce {
          0% { transform: scale(1, 1); }
          15% { transform: scale(1, 1.4); } 
          30% { transform: scale(1.15, 0.9); }
          55% { transform: scale(0.95, 1.05); }
          75% { transform: scale(1.02, 0.98); }
          100% { transform: scale(1, 1); }
        }

        .jelly-button-wrapper {
          display: inline-block;
          position: relative;
          text-decoration: none;
        }

        .jelly-button {
          background: #128077;
          padding: 12px 32px;
          border-radius: 3px;
          position: relative;
          border: none;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center bottom;
          z-index: 2;
          transition: background-color 0.2s ease;
          text-decoration: none;
        }
        
        .jelly-button.animating {
          animation: jelly-bounce 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) both;
        }

        .jelly-button:hover {
          cursor: pointer;
          background: #2980b9;
        }

        .jelly-button p {
          font-family: "Roboto", sans-serif;
          font-weight: 500;
          font-size: 1rem;
          margin: 0;
          text-align: center;
          text-transform: uppercase;
          color: #FFF;
          user-select: none;
        }

        .jelly-button-shadow {
          content: "";
          display: block;
          position: absolute;
          width: 80%;
          height: 10px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.2);
          bottom: -8px;
          left: 10%;
          z-index: 1;
        }
      `}</style>

      {}
      <div className={`jelly-button-wrapper ${className}`}>
        <Component 
          href={href}
          className={`jelly-button ${isAnimating ? 'animating' : ''}`} 
          onClick={handleClick}
          aria-label={typeof children === 'string' ? children : 'Jelly Button'}
        >
          <p>{children}</p>
        </Component>
        <div className="jelly-button-shadow"></div>
      </div>
    </>
  );
}