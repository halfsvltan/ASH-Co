import "./Footer.css";

export default function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="footer__container">
        {/* BRAND */}
        <div className="footer__brand">
          <h3>ASH Co.</h3>
          <p>
            Jasa sablon DTF, DTG, bordir, pakaian jadi, dan merchandise custom.
          </p>
        </div>

        {/* CONTACT */}
        <div className="footer__section">
          <h4>Contact</h4>
          <ul>
            <li>📍 Jakarta</li>
            <li>📞 08xxxxxxxxxx</li>
            <li>✉️ ash@example.com</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div className="footer__section">
          <h4>Social Media</h4>
          <ul>
            <li>Facebook</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        © {new Date().getFullYear()} ASH Co. All rights reserved.
      </div>
    </footer>
  );
}
