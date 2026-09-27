import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import reviews from '../data/reviews.json'

const FEATURED = reviews.filter((r) => r.featured)

export default function Testimonials() {
  return (
    <section id="testimonials" className="band">
      <style>{`
        .testi-more {
          margin-top: 44px;
          padding-bottom: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .testi-read-all-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #ffffff !important;
          font-size: 1.05rem;
          font-weight: 600;
          text-decoration: none;
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          box-shadow: none !important;
          transition: gap 0.2s ease;
        }
        .testi-read-all-link:hover {
          background: transparent !important;
          color: #ffffff !important;
          text-decoration: underline;
          text-underline-offset: 4px;
          gap: 12px;
        }
        .testi-read-all-link svg {
          transition: transform 0.2s ease;
        }
        .testi-read-all-link:hover svg {
          transform: translateX(4px);
        }
      `}</style>

      <div className="wrap">
        <div className="section-head center">
          <span className="kicker">Reviews</span>
          <h2>What customers say.</h2>
        </div>
        <div className="testi-grid">
          {FEATURED.map((review) => (
            <div className="testi-card" key={review.id}>
              <StarRating value={review.rating} size={16} />
              <blockquote>{review.quote}</blockquote>
              <footer>{review.name}, {review.role}</footer>
            </div>
          ))}
        </div>
        <div className="testi-more">
          <Link to="/reviews" className="testi-read-all-link">
            <span>Read all reviews</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}