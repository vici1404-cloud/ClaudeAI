import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#" className="navbar-brand">
          <span className="navbar-logo">&#x1f33f;</span>
          <span className="navbar-title">Serenity</span>
        </a>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          <a href="#features" className="nav-link" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#wellness" className="nav-link" onClick={() => setMobileOpen(false)}>Wellness</a>
          <a href="#insights" className="nav-link" onClick={() => setMobileOpen(false)}>Insights</a>
          <a href="#contact" className="nav-link" onClick={() => setMobileOpen(false)}>Contact</a>
          <a href="#" className="nav-cta" onClick={() => setMobileOpen(false)}>Get Started</a>
        </div>

        <button
          className={`navbar-toggle ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
