const steps = [
  {
    number: '01',
    title: 'Employees Share',
    description:
      'Your team rates morale, culture, and their day-to-day experience, then adds the context behind the numbers.',
    icon: (      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Feedback is Organized',
    description:
      'Every response is stored securely and sorted into a clear view that leadership can trust and explore.',    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 7h16M4 12h16M4 17h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <rect
          x="2"
          y="3"
          width="20"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Management Understands',
    description:
      'Spot trends early, understand what is working, and focus improvements where your people need them most.',    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6M9 19h6M9 19H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 3v4M8 5h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works section-surface section-surface--slate">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            From first feedback to informed action in three straightforward steps.
          </p>
        </div>
        <div className="how-it-works__steps">
          {steps.map((step, index) => (
            <div key={step.number} className="how-it-works__step">
              {index < steps.length - 1 && (
                <div className="how-it-works__connector" aria-hidden="true" />
              )}
              <div className="how-it-works__step-top">
                <span className="how-it-works__number">{step.number}</span>
                <div className="how-it-works__icon">{step.icon}</div>
              </div>
              <h3 className="how-it-works__title">{step.title}</h3>
              <p className="how-it-works__description">{step.description}</p>
            </div>
          ))}        </div>
      </div>
    </section>
  )
}

export default HowItWorks
