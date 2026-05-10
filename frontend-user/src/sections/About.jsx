import "./About.css";

export default function About() {
  return (
    <section className="about">
      <div className="about__container">
        {/* LEFT */}
        <div className="about__text">
          <h2>Tentang ASH Co.</h2>
          <p>
            <strong>ASH Co.</strong> adalah usaha custom pakaian yang melayani
            <span> Sablon DTF, DTG, dan Bordir </span>
            dengan kualitas tinggi, hasil presisi, dan ramah di kantong.
          </p>
          <p>
            Kami menyediakan <strong>kaos polos</strong>, pakaian jadi
            original <strong>pabrikan dan buatan design kami</strong>, serta juga bisa membuat
            <strong> merchandise custom</strong> seperti gantungan kunci,
            korek api, hingga pembuatan banner.
          </p>
          <p>
            Cocok untuk kebutuhan <strong>personal, komunitas, event,
            hingga bisnis</strong> dengan proses cepat dan hasil konsisten.
          </p>
        </div>

        {/* RIGHT */}
        <div className="about__highlight">
          <div className="highlight-box">
            <h3>DTF & DTG</h3>
            <p>Detail tajam & warna solid</p>
          </div>
          <div className="highlight-box">
            <h3>Bordir</h3>
            <p>Rapi, kuat, dan awet</p>
          </div>
          <div className="highlight-box">
            <h3>Custom</h3>
            <p>Bisa satuan & partai</p>
          </div>
        </div>
      </div>
    </section>
  );
}
