// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Defer scroll check to the next macro-task so React finishes mounting section elements
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);

      return () => clearTimeout(timer);
    } else {
      // Instant reset to top on route changes without hash
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}