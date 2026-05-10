import "./Footer.css";

import {
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";

import {
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="footer" className="footer">
      <div className="footer__container">

        {/* BRAND */}
        <div className="footer__brand">
          <h3>ASH Co.</h3>

          <p>
            Jasa sablon DTF, DTG, bordir,
            pakaian jadi, dan merchandise custom.
          </p>
        </div>

        {/* CONTACT */}
        <div className="footer__section">
          <h4>Contact</h4>

          <ul>
            <li>
              <FiMapPin className="footer-icon" />
              Jakarta
            </li>

            <li>
              <FiPhone className="footer-icon" />
              08xxxxxxxxxx
            </li>

            <li>
              <FiMail className="footer-icon" />
              ash@example.com
            </li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div className="footer__section">
          <h4>Social Media</h4>

          <ul>
            <li>
              <FaFacebookF className="footer-icon" />
              Facebook
            </li>

            <li>
              <FaInstagram className="footer-icon" />
              Instagram
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        © {new Date().getFullYear()} ASH Co.
        All rights reserved.
      </div>
    </footer>
  );
}