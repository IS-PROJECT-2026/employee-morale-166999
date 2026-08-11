const employeeBenefits = [
  'Share feedback in minutes, not after a long survey cycle',
  'Speak up about concerns without the friction of informal channels',
  'Rate the workplace experiences that matter most to you',
  'Use one simple platform instead of scattered forms and emails',
]

const managementBenefits = [
  'Get a clearer read on morale before small issues become big ones',
  'Pinpoint culture gaps with structured data, not guesswork',
  'Review feedback in one organized place built for action',
  'Make workplace decisions backed by what employees actually feel',
]
function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M16.667 5L7.5 14.167 3.333 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EmployeeManagementBenefits() {
  return (
    <section id="benefits" className="benefits section-surface section-surface--warm">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Two Sides. One Platform.</h2>
          <p className="section-subtitle">
            WorkPulse meets employees where they are and gives leadership the
            visibility to lead with empathy and confidence.
          </p>        </div>
        <div className="benefits__grid">
          <div className="benefits__card benefits__card--employees">
            <div className="benefits__card-header">
              <div className="benefits__card-icon benefits__card-icon--employees">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <h3 className="benefits__card-title">For Employees</h3>
            </div>
            <ul className="benefits__list">
              {employeeBenefits.map((item) => (
                <li key={item} className="benefits__item">
                  <span className="benefits__check benefits__check--employees">
                    <CheckIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="benefits__card benefits__card--management">
            <div className="benefits__card-header">
              <div className="benefits__card-icon benefits__card-icon--management">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M3 3v18h18M7 16l4-4 4 4 5-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="benefits__card-title">For Management</h3>
            </div>
            <ul className="benefits__list">
              {managementBenefits.map((item) => (
                <li key={item} className="benefits__item">
                  <span className="benefits__check benefits__check--management">
                    <CheckIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EmployeeManagementBenefits
