const indicators = [
  {
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
    label: 'Employee Feedback',
    description: 'Capture honest input in a format your team will actually use.',
  },
  {
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
    label: 'Workplace Culture',
    description: 'See the patterns shaping how people experience work every day.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 20V10M18 20V4M6 20v-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: 'Actionable Insights',
    description: 'Move from scattered comments to decisions that make a difference.',
  },
]

function ValueStatement() {
  return (
    <section className="value-statement section-surface section-surface--teal">
      <div className="container">
        <div className="value-statement__layout">
          <div className="value-statement__header">
            <h2 className="value-statement__title">
              Stop Guessing. Start Listening.
            </h2>
            <p className="value-statement__text">
              The best workplaces do not guess how their people feel. They listen,
              learn, and act. WorkPulse turns everyday employee input into the clarity
              your leadership team needs to strengthen culture and morale.
            </p>          </div>
          <div className="value-statement__indicators">
            {indicators.map((item) => (
              <div key={item.label} className="value-statement__indicator">
                <div className="value-statement__icon">{item.icon}</div>
                <h3 className="value-statement__label">{item.label}</h3>
                <p className="value-statement__desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ValueStatement
