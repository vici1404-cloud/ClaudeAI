import './Insights.css'

function Insights() {
  const weekData = [
    { day: 'Mon', value: 65, mood: 'Calm' },
    { day: 'Tue', value: 78, mood: 'Focused' },
    { day: 'Wed', value: 55, mood: 'Tired' },
    { day: 'Thu', value: 82, mood: 'Energized' },
    { day: 'Fri', value: 90, mood: 'Peaceful' },
    { day: 'Sat', value: 88, mood: 'Happy' },
    { day: 'Sun', value: 92, mood: 'Serene' },
  ]

  const maxValue = Math.max(...weekData.map(d => d.value))

  return (
    <section className="insights" id="insights">
      <div className="insights-container">
        <div className="insights-content">
          <span className="section-badge lavender-badge">Insights</span>
          <h2 className="section-title">Understand Your Patterns</h2>
          <p className="section-subtitle" style={{ textAlign: 'left' }}>
            Beautiful visualizations help you see the connection between
            your habits and how you feel. Track progress effortlessly.
          </p>

          <div className="insight-highlights">
            <div className="highlight-item">
              <div className="highlight-dot sage"></div>
              <div>
                <div className="highlight-label">Best day this week</div>
                <div className="highlight-value">Sunday &mdash; 92 pts</div>
              </div>
            </div>
            <div className="highlight-item">
              <div className="highlight-dot ocean"></div>
              <div>
                <div className="highlight-label">Average mood</div>
                <div className="highlight-value">Positive trend +15%</div>
              </div>
            </div>
            <div className="highlight-item">
              <div className="highlight-dot lavender"></div>
              <div>
                <div className="highlight-label">Consistency</div>
                <div className="highlight-value">7 of 7 days tracked</div>
              </div>
            </div>
          </div>
        </div>

        <div className="insights-chart-wrapper">
          <div className="chart-card">
            <div className="chart-header">
              <h4>Weekly Wellness Score</h4>
              <span className="chart-period">This Week</span>
            </div>
            <div className="chart-bars">
              {weekData.map((item, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-tooltip">{item.mood}</div>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill"
                      style={{
                        height: `${(item.value / maxValue) * 100}%`,
                        animationDelay: `${index * 0.1 + 0.3}s`,
                      }}
                    ></div>
                  </div>
                  <span className="chart-bar-label">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Insights
