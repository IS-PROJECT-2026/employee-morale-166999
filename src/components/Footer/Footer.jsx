import LogoIcon from '../Logo/LogoIcon'

const footerNav = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
]

const legalLinks = [
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
]

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#home" className="footer__logo">
              <LogoIcon className="footer__logo-icon" />
              <span>WorkPulse</span>
            </a>
            <p className="footer__description">
              WorkPulse helps organizations understand team sentiment, culture,
              and the employee experience through feedback that leads somewhere.
            </p>
          </div>

          <nav className="footer__nav" aria-label="Footer navigation">
            <h4 className="footer__nav-title">Navigation</h4>
            <ul className="footer__nav-list">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer__nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer__nav" aria-label="Legal">
            <h4 className="footer__nav-title">Legal</h4>
            <ul className="footer__nav-list">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer__nav-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; 2026 WorkPulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
