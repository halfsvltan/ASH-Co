import { useEffect, useRef, useState } from "react";
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
  },
  {
    image: slide2,
    title: "Kaos Polos Adem & Kece",
    desc: "Lo pengen simple tapi cool? Kaos polos solusinya! Kita menyediakan kaos polos lengan pendek, lengan panjang, dan oversize dengan warna yang beragam serta ukuran yang cocok di lo, bre!",
  },
  {
    image: slide3,
    title: "Produk Kece Buatan Kami",
    desc: "Kita juga punya pakaian hasil design kita sendiri, lho! Kita juga stock produk original pabrikan juga.",
  },
  {
    image: slide4,
    title: "Merch & Banner Custom",
    desc: "Weh, dikira kita cuma bisa nyablon sama bordir? Kita juga bisa bikin merch custom yang lo pengen kok! Kita juga bisa bikin banner buat acara yang lo bakal hadirin.",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  // TOUCH REF
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // SWIPE MOBILE
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;

    if (touchStartX.current - touchEndX.current > 50) {
      setIndex((prev) => (prev + 1) % slides.length);
    }

    if (touchEndX.current - touchStartX.current > 50) {
      setIndex((prev) =>
        prev === 0 ? slides.length - 1 : prev - 1
      );
    }
  };

  return (
    <section
      className="hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero__slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero__overlay"></div>

          <div className="hero__content">
            <span className="hero__badge">ASH CLOTHING</span>

            <h1>{slide.title}</h1>

            <p>{slide.desc}</p>
          </div>
        </div>
      ))}

      {/* DOT INDICATOR */}
      <div className="hero__dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`hero__dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}