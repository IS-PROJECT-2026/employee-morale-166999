const features = [
  {
    title: 'Employee Feedback',
    description:
      'Replace one-off forms with a feedback flow your team will actually complete.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Morale Ratings',
    description:
      'Track how people feel about morale, culture, and the environment over time.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.8 5.7 21l2.3-7-6-4.6h7.6L12 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Anonymous / Private Feedback',
    description:
      'Encourage open, honest input in a space designed to protect employee trust.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="3"
          y="11"
          width="18"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M7 11V7a5 5 0 0110 0v4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Employee Management',
    description:
      'Keep employee profiles organized so feedback always connects to the right people.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Management Insights',
    description:
      'Transform raw feedback into trends and priorities leadership can act on quickly.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M18 20V10M12 20V4M6 20v-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: 'Secure Data',
    description:
      'Protect sensitive workplace data with secure storage powered by Firebase.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

function Features() {
  return (
    <section id="features" className="features section-surface">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Everything You Need to Understand Your Workplace
          </h2>
          <p className="section-subtitle">
            Everything your organization needs to listen deeply, read the signals,
            and respond with confidence.
          </p>        </div>
        <div className="features__grid">
          {features.map((feature) => (
            <article key={feature.title} className="features__card">
              <div className="features__icon">{feature.icon}</div>
              <h3 className="features__title">{feature.title}</h3>
              <p className="features__description">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
