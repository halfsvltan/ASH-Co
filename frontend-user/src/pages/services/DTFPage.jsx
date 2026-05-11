// src/pages/services/DTFPage.jsx

import { useRef, useState } from "react";
import "./DTFPage.css";

import kaosPolos from "../../assets/images/kaoshitampolospendek.jpg";

const tshirts = [
  {
    id: 1,
    name: "Cotton Combed 20s",
    desc: "Bahan tebal, nyaman, cocok untuk daily wear premium.",
  },
  {
    id: 2,
    name: "Cotton Combed 24s",
    desc: "Ketebalan medium dengan tekstur lembut.",
  },
  {
    id: 3,
    name: "Cotton Combed 30s",
    desc: "Lebih ringan dan adem digunakan sehari-hari.",
  },
];

const sizesAdult = ["S", "M", "L", "XL", "XXL"];
const sizesKids = ["XS Kids", "S Kids", "M Kids", "L Kids"];

export default function DTFPage() {
  const [selectedShirt, setSelectedShirt] = useState(tshirts[0]);
  const [size, setSize] = useState("M");
  const [category, setCategory] = useState("Dewasa");

  const [uploadedImage, setUploadedImage] = useState(null);

  const [position, setPosition] = useState({ x: 120, y: 140 });
  const [scale, setScale] = useState(120);

  const fileRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="dtf-page">

      <div className="dtf-header">
        <h1>Sablon DTF Custom</h1>
        <p>Pilih kaos, ukuran, lalu upload desain.</p>
      </div>

      <div className="dtf-container">

        {/* LEFT */}
        <div className="dtf-sidebar">

          <h2>Kategori</h2>

          <div className="category-buttons">
            <button
              className={category === "Dewasa" ? "active" : ""}
              onClick={() => {
                setCategory("Dewasa");
                setSize("M");
              }}
            >
              Dewasa
            </button>

            <button
              className={category === "Anak" ? "active" : ""}
              onClick={() => {
                setCategory("Anak");
                setSize("S Kids");
              }}
            >
              Anak
            </button>
          </div>

          <h2>Jenis Kaos</h2>

          <div className="shirt-list">
            {tshirts.map((item, index) => (
              <div
                key={index}
                className={`shirt-card ${
                  selectedShirt.id === item.id ? "selected" : ""
                }`}
                onClick={() => setSelectedShirt(item)}
              >
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2>Ukuran</h2>

          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            {(category === "Dewasa"
              ? sizesAdult
              : sizesKids
            ).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <h2>Upload Design</h2>

          <button
            className="upload-btn"
            onClick={() => fileRef.current.click()}
          >
            Upload Gambar
          </button>

          <input
            type="file"
            hidden
            ref={fileRef}
            accept="image/*"
            onChange={handleUpload}
          />

          <div className="slider-box">
            <label>Ukuran Design</label>
            <input
              type="range"
              min="50"
              max="250"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </div>

          <div className="slider-box">
            <label>Geser Horizontal</label>
            <input
              type="range"
              min="0"
              max="300"
              value={position.x}
              onChange={(e) =>
                setPosition({ ...position, x: Number(e.target.value) })
              }
            />
          </div>

          <div className="slider-box">
            <label>Geser Vertikal</label>
            <input
              type="range"
              min="0"
              max="400"
              value={position.y}
              onChange={(e) =>
                setPosition({ ...position, y: Number(e.target.value) })
              }
            />
          </div>

        </div>

        {/* RIGHT */}
        <div className="preview-section">

          <div className="preview-card">

            {/* KAOS IMAGE ASSET */}
            <div className="tshirt-preview">

              <img
                src={kaosPolos}
                className="base-shirt"
                alt="kaos"
              />

              {/* DESIGN */}
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  className="design-image"
                  style={{
                    width: `${scale}px`,
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                  }}
                />
              )}

            </div>

            <div className="preview-info">
              <h3>{selectedShirt.name}</h3>
              <p>{size}</p>
              <p>{category}</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}