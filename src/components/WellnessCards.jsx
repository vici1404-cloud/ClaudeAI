import { useState } from 'react'
import './WellnessCards.css'

const dailyTips = [
  { text: 'Take 5 deep breaths before your morning coffee', category: 'Breathing' },
  { text: 'Write down 3 things you are grateful for today', category: 'Gratitude' },
  { text: 'Step outside for a 10-minute nature walk', category: 'Movement' },
  { text: 'Drink a glass of water mindfully, savoring each sip', category: 'Hydration' },
]

function WellnessCards() {
  const [activeTip, setActiveTip] = useState(0)

  const stats = [
    { label: 'Mindful Minutes', value: '2,450', change: '+12%', icon: '&#x23f3;' },
    { label: 'Sessions Completed', value: '148', change: '+8%', icon: '&#x2705;' },
    { label: 'Current Streak', value: '14 days', change: '+2', icon: '&#x1f525;' },
    { label: 'Community Rank', value: 'Top 5%', change: 'Rising', icon: '&#x2b50;' },
  ]

  return (
    <section className="wellness" id="wellness">
      <div className="wellness-container">
        <div className="section-header">
          <span className="section-badge ocean-badge">Wellness</span>
          <h2 className="section-title">Your Wellness at a Glance</h2>
          <p className="section-subtitle">
            Track your progress with beautiful visualizations that make
            self-improvement feel rewarding.
          </p>
        </div>

        <div className="wellness-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" dangerouslySetInnerHTML={{ __html: stat.icon }} />
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-change">{stat.change}</div>
            </div>
          ))}
        </div>

        <div className="wellness-daily">
          <div className="daily-header">
            <h3>Daily Mindfulness Tips</h3>
            <p>Small actions, big impact</p>
          </div>
          <div className="daily-tips">
            {dailyTips.map((tip, index) => (
              <button
                key={index}
                className={`daily-tip ${activeTip === index ? 'active' : ''}`}
                onClick={() => setActiveTip(index)}
              >
                <span className="tip-category">{tip.category}</span>
                <span className="tip-text">{tip.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WellnessCards
