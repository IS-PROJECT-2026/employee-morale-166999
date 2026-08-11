import { useState, useCallback } from 'react'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import ValueStatement from '../components/ValueStatement/ValueStatement'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import Features from '../components/Features/Features'
import EmployeeManagementBenefits from '../components/EmployeeManagementBenefits/EmployeeManagementBenefits'
import CallToAction from '../components/CallToAction/CallToAction'
import Footer from '../components/Footer/Footer'

import '../components/Navbar/Navbar.css'
import '../components/Hero/Hero.css'
import '../components/ValueStatement/ValueStatement.css'
import '../components/HowItWorks/HowItWorks.css'
import '../components/Features/Features.css'
import '../components/EmployeeManagementBenefits/EmployeeManagementBenefits.css'
import '../components/CallToAction/CallToAction.css'
import '../components/Footer/Footer.css'
import './LandingPage.css'

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleToggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev)
  }, [])

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  return (
    <div className="landing-page">
      <Navbar
        menuOpen={menuOpen}
        onToggleMenu={handleToggleMenu}
        onCloseMenu={handleCloseMenu}
      />
      <main className="landing-page__main">
        <Hero />
        <ValueStatement />
        <HowItWorks />
        <Features />
        <EmployeeManagementBenefits />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
