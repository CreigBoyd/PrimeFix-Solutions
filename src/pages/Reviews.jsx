import React from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating';
import ReviewModal from '../components/ReviewModal';
import reviews from '../data/reviews.json';
import usePageTitle from '../hooks/usePageTitle';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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

      <section className="reviews-page">
        <div className="wrap">
         
         <div className="section-head center">
            <span className="kicker">Reviews</span>
            <h1>What customers say.</h1>
            <p>{count > 0 ? 'Real feedback from real jobs — the good, and the occasional four-star.' : 'Reviews from our customers will appear here.'}</p>
          </div>

          <div className="reviews-summary">
            {count > 0 ? (
              <>
                <div className="reviews-summary-score">{average.toFixed(1)}</div>
                <div>
                  <StarRating value={Math.round(average)} size={22} />
                  <p>{count} review{count === 1 ? '' : 's'}</p>
                </div>
              </>
            ) : (
              <div>
                <p>No reviews yet. Worked with us? We would love to hear how it went.</p>
              </div>
            )}
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