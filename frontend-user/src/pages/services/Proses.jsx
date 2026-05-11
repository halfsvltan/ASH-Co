// src/pages/Proses.jsx

import "./Proses.css";

export default function Proses() {
  const waNumber = "62881025326521"; // format internasional (tanpa 0)

  return (
    <div className="proses-page">
      <div className="proses-card">
        <h1>Sabar bre!</h1>

        <p>
          Lagi dibuat dulu, asli pala gue puyeng.
          <br />
          Nanti juga kelar gue info dah.
        </p>

        <p className="sub-text">
          Kalau mau tanya-tanya atau order, ke WA gue aja.
        </p>

        <a
          href={`https://wa.me/${62881025326521}`}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-button"
        >
          Meluncur ke WA
        </a>
      </div>
    </div>
  );
}