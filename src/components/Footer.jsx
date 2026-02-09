import './Footer.css'

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-cta">
          <h2>Begin Your Wellness Journey</h2>
          <p>
            Join thousands who have found peace, clarity, and balance
            with Serenity. Start your free trial today.
          </p>
          <div className="footer-cta-actions">
            <a href="#" className="btn btn-primary btn-lg">
              Start Free Trial
            </a>
            <span className="footer-note">No credit card required</span>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span>&#x1f33f;</span>
              <span>Serenity</span>
            </div>
            <p className="footer-tagline">
              Mindful living, beautifully designed.
            </p>
          </div>

          <div className="footer-column">
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Integrations</a>
            <a href="#">Changelog</a>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <a href="#">Blog</a>
            <a href="#">Guides</a>
            <a href="#">Community</a>
            <a href="#">Support</a>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Serenity. Crafted with care for your wellbeing.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
