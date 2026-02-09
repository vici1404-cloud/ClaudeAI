import './Testimonials.css'

const testimonials = [
  {
    quote: "Serenity has completely changed my morning routine. The gentle reminders and soothing interface make mindfulness feel natural, not forced.",
    name: 'Maya Chen',
    role: 'Yoga Instructor',
    avatar: 'MC',
    color: 'sage',
  },
  {
    quote: "I love how calming the whole experience is. The color palette alone reduces my stress before I even start a session.",
    name: 'James Rivera',
    role: 'UX Designer',
    avatar: 'JR',
    color: 'ocean',
  },
  {
    quote: "The sleep tracking insights helped me identify patterns I never noticed. I'm sleeping better and waking up refreshed.",
    name: 'Ava Thompson',
    role: 'Software Engineer',
    avatar: 'AT',
    color: 'lavender',
  },
]

function Testimonials() {
  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <div className="section-header">
          <span className="section-badge sand-badge">Community</span>
          <h2 className="section-title">Loved by Thousands</h2>
          <p className="section-subtitle">
            See what our community says about their journey with Serenity.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <div key={index} className={`testimonial-card testimonial-${item.color}`}>
              <div className="testimonial-quote">
                <svg className="quote-icon" width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M10 11H6C6 7.5 8.5 5.5 11 5L10.5 3C6.5 3.5 3 7 3 12V19H10V11ZM21 11H17C17 7.5 19.5 5.5 22 5L21.5 3C17.5 3.5 14 7 14 12V19H21V11Z" fill="currentColor"/>
                </svg>
                <p>{item.quote}</p>
              </div>
              <div className="testimonial-author">
                <div className={`testimonial-avatar avatar-${item.color}`}>
                  {item.avatar}
                </div>
                <div>
                  <div className="testimonial-name">{item.name}</div>
                  <div className="testimonial-role">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
