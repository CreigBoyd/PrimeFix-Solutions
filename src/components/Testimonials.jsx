import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import reviews from '../data/reviews.json'

const FEATURED = reviews.filter((r) => r.featured)

export default function Testimonials() {
  return (
    <section id="testimonials" className="band">
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
          <Link to="/reviews" className="btn btn-outline">Read all reviews</Link>
        </div>
      </div>
    </section>
  )
}
