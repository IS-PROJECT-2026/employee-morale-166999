import LogoIcon from '../Logo/LogoIcon'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
]

function Navbar({ menuOpen, onToggleMenu, onCloseMenu }) {
  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <a href="#home" className="navbar__brand" onClick={onCloseMenu}>
          <LogoIcon className="navbar__logo-icon" />
          <span className="navbar__brand-name">WorkPulse</span>
        </a>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="navbar__link" onClick={onCloseMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="navbar__actions">
            <a href="#login" className="navbar__login" onClick={onCloseMenu}>
              Log In
            </a>
            <a href="#signup" className="btn btn-primary navbar__cta" onClick={onCloseMenu}>
              Get Started
            </a>
          </div>
        </nav>

        <button
          type="button"
          className={`navbar__toggle ${menuOpen ? 'navbar__toggle--open' : ''}`}
          onClick={onToggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

export default Navbar
