import './Features.css'

const features = [
  {
    icon: '&#x1f9d8;',
    title: 'Guided Meditation',
    description: 'Curated sessions designed to reduce stress and improve focus with gentle, nature-inspired soundscapes.',
    color: 'sage',
  },
  {
    icon: '&#x1f4ca;',
    title: 'Mood Tracking',
    description: 'Visualize your emotional patterns over time with beautiful, intuitive charts and gentle daily check-ins.',
    color: 'ocean',
  },
  {
    icon: '&#x1f4a4;',
    title: 'Sleep Analysis',
    description: 'Understand your sleep quality with detailed insights and personalized recommendations for better rest.',
    color: 'lavender',
  },
  {
    icon: '&#x1f343;',
    title: 'Breathing Exercises',
    description: 'Follow calming breath patterns with smooth visual guides that adapt to your comfort level.',
    color: 'sage',
  },
  {
    icon: '&#x1f4dd;',
    title: 'Gratitude Journal',
    description: 'Cultivate positivity with daily prompts and a private space to reflect on moments of joy.',
    color: 'sand',
  },
  {
    icon: '&#x1f30a;',
    title: 'Nature Sounds',
    description: 'Immerse yourself in high-quality ambient sounds from forests, oceans, rain, and gentle winds.',
    color: 'ocean',
  },
]

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2 className="section-title">Everything You Need to Thrive</h2>
          <p className="section-subtitle">
            A thoughtfully designed toolkit to support your mental wellness,
            one mindful moment at a time.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card feature-${feature.color}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon" dangerouslySetInnerHTML={{ __html: feature.icon }} />
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <a href="#" className="feature-link">
                Learn more
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
