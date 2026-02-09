import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-shapes">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
        <div className="hero-shape hero-shape-3"></div>
      </div>

      <div className="hero-content">
        <span className="hero-badge">Mindful Living</span>
        <h1 className="hero-title">
          Find Your <span className="hero-accent">Inner Peace</span>
        </h1>
        <p className="hero-subtitle">
          Track your wellness journey with a beautifully crafted experience
          designed to bring calm and clarity to your daily routine.
        </p>
        <div className="hero-actions">
          <a href="#features" className="btn btn-primary">
            Explore Features
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#wellness" className="btn btn-ghost">
            Learn More
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-card-stack">
          <div className="hero-float-card card-mood">
            <div className="float-icon">&#x2600;&#xfe0f;</div>
            <div>
              <div className="float-label">Today's Mood</div>
              <div className="float-value">Peaceful</div>
            </div>
          </div>
          <div className="hero-float-card card-streak">
            <div className="float-icon">&#x1f331;</div>
            <div>
              <div className="float-label">Meditation Streak</div>
              <div className="float-value">14 Days</div>
            </div>
          </div>
          <div className="hero-float-card card-score">
            <div className="float-icon">&#x1f4a7;</div>
            <div>
              <div className="float-label">Wellness Score</div>
              <div className="float-value">92/100</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
