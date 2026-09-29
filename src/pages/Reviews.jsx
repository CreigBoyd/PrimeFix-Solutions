import React from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating';
import ReviewModal from '../components/ReviewModal';
import reviews from '../data/reviews.json';
import usePageTitle from '../hooks/usePageTitle';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export default function Reviews() {
  // Sets the browser tab title to "Customer Reviews | PrimeFix Solutions"
  usePageTitle('Customer Reviews');

  const [modalOpen, setModalOpen] = useState(false);

  const { average, count } = useMemo(() => {
    const count = reviews.length;
    const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    return { average, count };
  }, []);

  const sorted = useMemo(
    () => [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date)),
    []
  );

  return (
    <>
      <style>{`
        .rev-top-nav-bar {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 20px;
        }
        .rev-home-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-soft, #94a3b8);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: color 0.2s;
        }
        .rev-home-link:hover {
          color: var(--teal, #128077);
        }
      `}</style>

      <section className="reviews-page">
        <div className="wrap">
          {/* Breadcrumb Home Link */}
          <div className="rev-top-nav-bar">
            <Link to="/" className="rev-home-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="section-head center">
            <span className="kicker">Reviews</span>
            <h2>What customers say.</h2>
            <p>Real feedback from real jobs — the good, and the occasional four-star.</p>
          </div>

          <div className="reviews-summary">
            <div className="reviews-summary-score">{average.toFixed(1)}</div>
            <div>
              <StarRating value={Math.round(average)} size={22} />
              <p>{count} review{count === 1 ? '' : 's'}</p>
            </div>
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              Leave a review
            </button>
          </div>

          <div className="reviews-grid">
            {sorted.map((review) => (
              <article className="review-card" key={review.id}>
                <StarRating value={review.rating} size={16} />
                <blockquote>{review.quote}</blockquote>
                <footer>
                  <div>
                    <strong>{review.name}</strong>
                    <span className="review-role">{review.role}</span>
                  </div>
                  <div className="review-meta">
                    <span className="review-service-tag">{review.service}</span>
                    <span className="review-date">{formatDate(review.date)}</span>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ReviewModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}