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