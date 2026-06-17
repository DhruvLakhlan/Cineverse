import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div>
            <div className="site-footer-brand">
              <div className="site-footer-logo">▶</div>
              <span className="site-footer-name">Cine<span>Verse</span></span>
            </div>
            <p className="site-footer-desc">
              Your premium movie ticket booking platform. Enjoy the best cinema experience.
            </p>
          </div>
          <div>
            <h4 className="site-footer-heading">Quick Links</h4>
            <div className="site-footer-links">
              {["Movies", "Theatres", "Offers", "Gift Cards"].map(l => (
                <span key={l} className="site-footer-link">{l}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="site-footer-heading">Support</h4>
            <div className="site-footer-links">
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map(l => (
                <span key={l} className="site-footer-link">{l}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="site-footer-heading">Follow Us</h4>
            <div className="site-footer-social">
              {["𝕏", "📘", "📷", "▶"].map((icon, i) => (
                <span key={i} className="site-footer-social-btn" aria-hidden="true">{icon}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="site-footer-bottom">
          <p>© 2026 CineVerse. All rights reserved.</p>
          <p>Built with ❤️ for movie lovers</p>
        </div>
      </div>
    </footer>
  );
}
