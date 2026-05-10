import { useEffect, useRef, useState } from "react";
import "./Products.css";

// IMPORT GAMBAR
import kaos1 from "../assets/images/contoh-kaos.png";
import kaos2 from "../assets/images/jersey.jpg";
import kaos3 from "../assets/images/contoh-kaos1.png";

import jaket1 from "../assets/images/contoh-jaket.jpg";
import jaket2 from "../assets/images/contoh-jaket1.jpg";
import jaket3 from "../assets/images/contoh-jaket2.jpg";

import celana1 from "../assets/images/contoh-celana.jpg";
import celana2 from "../assets/images/contoh-celana1.jpg";
import celana3 from "../assets/images/contoh-celana2.jpg";

import topi1 from "../assets/images/contoh-topi.jpg";
import topi2 from "../assets/images/contoh-topi1.jpg";
import topi3 from "../assets/images/contoh-topi2.jpg";

import merch1 from "../assets/images/contoh-merch.jpg";
import merch2 from "../assets/images/contoh-merch1.jpg";
import merch3 from "../assets/images/contoh-merch2.jpg";

const kategoriProduk = [
  {
    nama: "Kaos Desain Eksklusif",
    deskripsi:
      "Kaos sablon full color dengan desain menarik dan bahan premium.",
    gambar: [kaos1, kaos2, kaos3],
  },
  {
    nama: "Jaket Premium",
    deskripsi:
      "Jaket dengan detail sablon dan bordir berkualitas tinggi.",
    gambar: [jaket1, jaket2, jaket3],
  },
  {
    nama: "Celana Kasual",
    deskripsi:
      "Celana nyaman dengan potongan modern untuk aktivitas harian.",
    gambar: [celana1, celana2, celana3],
  },
  {
    nama: "Topi Bordir",
    deskripsi:
      "Topi dengan bordir logo eksklusif dan tampilan stylish.",
    gambar: [topi1, topi2, topi3],
  },
  {
    nama: "Merchandise",
    deskripsi:
      "Merch custom untuk komunitas dan promosi bisnis.",
    gambar: [merch1, merch2, merch3],
  },
];

export default function Products() {
  return (
    <section id="products" className="products">
      <h2 className="section-title">Produk Jadi Pakai</h2>
      <p className="section-desc">
        Jangan galau kalo lo gabisa design kaos kece atau galau karena pengen beli produk ori tapi di pabrikan udah sold out. <span>
          Lo tinggal cek pakaian dengan design yang sesuai sama lo atau pakaian yang udah jadi wishlist lo disini!
        </span>
      </p>

      <div className="products-grid">
        {kategoriProduk.map((item, index) => (
          <ProductCard key={index} data={item} />
        ))}
      </div>

      <div className="products-cta">
        <button>Lihat Katalog Produk</button>
      </div>
    </section>
  );
}

function ProductCard({ data }) {
  const [active, setActive] = useState(0);
  const cardRef = useRef(null);
  const startX = useRef(0);

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % data.gambar.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [data.gambar.length]);

  // ANIMASI SAAT SCROLL
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, []);

  // SWIPE MOBILE
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;

    if (diff > 50) {
      setActive((prev) => (prev + 1) % data.gambar.length);
    } else if (diff < -50) {
      setActive((prev) =>
        prev === 0 ? data.gambar.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="product-card" ref={cardRef}>
      <div
        className="product-slider"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={data.gambar[active]}
          alt={data.nama}
          className="slide-image"
        />

        {/* DOT */}
        <div className="slider-dots">
          {data.gambar.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === active ? "active" : ""}`}
              onClick={() => setActive(idx)}
            />
          ))}
        </div>
      </div>

      <div className="product-content">
        <h3>{data.nama}</h3>
        <p>{data.deskripsi}</p>
      </div>
    </div>
  );
}
