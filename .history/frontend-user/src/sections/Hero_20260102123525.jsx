import { useEffect, useState } from "react";
import "./Hero.css";

import slide1 from "../assets/images/slide1.jpg";
import slide2 from "../assets/images/slide2.jpg";
import slide3 from "../assets/images/slide3.png";
import slide4 from "../assets/images/slide4.png";

const slides = [
  {
    image: slide1,
    title: "Sablon DTF & DTG Tahan Lama",
    desc: "Mau kaos polos lo tampil dengan kece? Di sablon aja, bre! Selain kaos, kita juga menyediakan jenis pakaian yang bisa disablon. lho!",
    button: "Lihat Layanan",
  },
  {
    image: slide2,
    title: "Kaos Polos Adem & Kece",
    desc: "Lo pengen simple tapi cool? Kaos polos solusinya! Kita menyediakan kaos polos lengan pendek, lengan panjang, dan oversize dengan warna yang beragam serta ukuran yang cocok di lo, bre!",
    button: "Lihat Produk",
  },
  {
    image: slide3,
    title: "Produk Kece Buatan Kami",
    desc: "Kita juga punya pakaian hasil design kita sendiri, lho! Kita juga stock produk original pabrikan juga.",
    button: "Cek Ketersediaan",
  },
  {
    image: slide4,
    title: "Merch & Banner Custom",
    desc: "Weh, dikira kita cuma bisa nyablon sama bordir? Kita juga bisa bikin merch custom yang lo pengen kok! Kita juga bisa bikin banner buat acara yang lo bakal hadirin.",
    button: "Lihat Layanan",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setIndex(index === 0 ? slides.length - 1 : index - 1);
  };

  const nextSlide = () => {
    setIndex((index + 1) % slides.length);
  };

  return (
    <section className="hero">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero__slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero__overlay"></div>

          <div className="hero__content">
            <h1>{slide.title}</h1>
            <p>{slide.desc}</p>
            <button>{slide.button}</button>
          </div>
        </div>
      ))}

      {/* NAVIGATION */}
      <button className="hero__nav left" onClick={prevSlide}>
        ❮
      </button>
      <button className="hero__nav right" onClick={nextSlide}>
        ❯
      </button>
    </section>
  );
}
