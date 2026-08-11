const metrics = [
  { label: 'Morale', score: 4.2 },
  { label: 'Culture', score: 4.5 },
  { label: 'Environment', score: 3.8 },
  { label: 'Engagement', score: 4.6 },
]

const monthlyTrend = [
  { month: 'Jan', value: 58 },
  { month: 'Feb', value: 65 },
  { month: 'Mar', value: 61 },
  { month: 'Apr', value: 72 },
  { month: 'May', value: 68 },
  { month: 'Jun', value: 78 },
  { month: 'Jul', value: 86, highlight: true },
]

function MoraleTrendChart() {
  const maxValue = Math.max(...monthlyTrend.map((bar) => bar.value))

  return (
    <div className="hero__trend">
      <div className="hero__trend-top">
        <div className="hero__trend-info">
          <div className="hero__trend-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M3 17l5-5 4 4 9-11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="hero__trend-title">Morale Trend</p>
            <p className="hero__trend-period">Last 7 months</p>
          </div>
        </div>
        <div className="hero__trend-stat">
          <span className="hero__trend-value">4.3</span>
          <span className="hero__trend-badge">
            <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M6 2v8M6 2l3 3M6 2L3 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            +8%
          </span>
        </div>
      </div>

      <div className="hero__trend-chart">
        <div className="hero__trend-grid" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="hero__trend-bars">
          {monthlyTrend.map((bar) => (
            <div key={bar.month} className="hero__trend-bar-col">
              <div className="hero__trend-bar-track">
                <div
                  className={`hero__trend-bar ${bar.highlight ? 'hero__trend-bar--highlight' : ''}`}
                  style={{ height: `${(bar.value / maxValue) * 100}%` }}
                >
                  {bar.highlight && (
                    <span className="hero__trend-bar-tip">4.3</span>
                  )}
                </div>
              </div>
              <span className={`hero__trend-month ${bar.highlight ? 'hero__trend-month--active' : ''}`}>
                {bar.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HeroVisual() {
  return (
    <div className="hero__visual" aria-hidden="true">
      <div className="hero__visual-card hero__visual-card--main">
        <div className="hero__visual-header">
          <span className="hero__visual-dot" />
          <span className="hero__visual-dot" />
          <span className="hero__visual-dot" />
        </div>
        <div className="hero__visual-body">
          <div className="hero__visual-row">
            <div className="hero__visual-avatar" />
            <div className="hero__visual-profile">
              <span className="hero__visual-name">Team Overview</span>
              <span className="hero__visual-meta">Monthly morale snapshot</span>
            </div>
            <div className="hero__visual-score-badge">
              <span className="hero__visual-score-value">4.3</span>
              <span className="hero__visual-score-label">Avg.</span>
            </div>
          </div>

          <div className="hero__visual-ratings">
            {metrics.map((item) => (
              <div key={item.label} className="hero__visual-rating">
                <span className="hero__visual-rating-label">{item.label}</span>
                <div className="hero__visual-rating-bar-wrap">
                  <div
                    className="hero__visual-rating-bar"
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  />
                </div>
                <span className="hero__visual-rating-score">{item.score}</span>
              </div>
            ))}
          </div>

          <MoraleTrendChart />

          <div className="hero__visual-mini-stats">
            <div className="hero__visual-mini-stat">
              <span className="hero__visual-mini-stat-icon hero__visual-mini-stat-icon--culture" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.8 5.7 21l2.3-7-6-4.6h7.6L12 2z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="hero__visual-mini-stat-text">
                <span className="hero__visual-mini-stat-label">Culture Score</span>
                <span className="hero__visual-mini-stat-value">4.5</span>
              </div>
            </div>
            <div className="hero__visual-mini-stat">
              <span className="hero__visual-mini-stat-icon hero__visual-mini-stat-icon--feedback" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="hero__visual-mini-stat-text">
                <span className="hero__visual-mini-stat-label">Feedback</span>
                <span className="hero__visual-mini-stat-value">128</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__visual-card hero__visual-card--float hero__visual-card--insights">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 17l4-4 4 4 8-10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="hero__visual-float-text">
          <span className="hero__visual-float-label">Monthly Morale</span>
          <span className="hero__visual-float-value">4.2</span>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section id="home" className="hero section-surface section-surface--hero">
      <div className="hero__inner container">
        <div className="hero__content">
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            WorkPulse Platform
          </p>
          <h1 className="hero__title">
            Culture Starts With{' '}
            <span className="hero__title-accent">Listening</span>
          </h1>
          <p className="hero__description">
            Your team deserves more than a suggestion box. WorkPulse gives employees
            a clear voice and gives leaders the insight to build a workplace people
            genuinely want to be part of.
          </p>
          <div className="hero__actions">
            <a href="#signup" className="btn btn-primary hero__btn hero__btn--primary">
              Get Started
            </a>
            <a href="#how-it-works" className="btn btn-secondary hero__btn">
              Learn More
            </a>
          </div>
          <ul className="hero__highlights">
            <li>Structured feedback</li>
            <li>Culture insights</li>
            <li>Built for teams</li>
          </ul>
        </div>
        <HeroVisual />
      </div>
      <div className="hero__bg-shape hero__bg-shape--1" aria-hidden="true" />
      <div className="hero__bg-shape hero__bg-shape--2" aria-hidden="true" />
    </section>
  )
}

export default Hero
