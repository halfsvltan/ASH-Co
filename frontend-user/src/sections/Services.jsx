import "./Services.css";

export default function Services() {
  const services = [
    {
      id: 1,
      title: "Sablon DTF",
      desc: "Cocok untuk desain full color dengan detail tinggi.",
      icon: "🎨",
    },
    {
      id: 2,
      title: "Sablon DTG",
      desc: "Hasil halus langsung ke kain, nyaman dipakai.",
      icon: "🖨️",
    },
    {
      id: 3,
      title: "Bordir",
      desc: "Jahitan rapi dan kuat untuk pakaian premium.",
      icon: "🧵",
    },
    {
      id: 4,
      title: "Banner & Promosi",
      desc: "Media promosi untuk usaha, event, dan komunitas.",
      icon: "📢",
    },
  ];



  return (
    <section id="services" className="services">
      <h2 className="section-title">Layanan Kami</h2>

      <div className="services__grid">
        {services.map((item) => (
          <div className="service-card" key={item.id}>
            <div className="service-icon">{item.icon}</div>

            <h3>{item.title}</h3>
            <p>{item.desc}</p>

            <button className="btn-service">
              Cek Selengkapnya
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
