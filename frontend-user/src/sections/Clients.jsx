import "./Clients.css";

import clientA from "../assets/images/client-a.png";
import clientB from "../assets/images/client-b.jpg";
import clientC from "../assets/images/client-c.jpg";
import clientD from "../assets/images/client-d.png";
import clientE from "../assets/images/client-e.png";

export default function Clients() {
  const clients = [
    { name: "Client A", logo: clientA },
    { name: "Client B", logo: clientB },
    { name: "Client C", logo: clientC },
    { name: "Client D", logo: clientD },
    { name: "Client E", logo: clientE },

  ];

  return (
    <section className="clients" id="clients">
      <h2 className="section-title">Our Clients</h2>

      <div className="clients__grid">
        {clients.map((client, index) => (
          <div className="client-card" key={index}>
            <img
              src={client.logo}
              alt={client.name}
              className="client-logo"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
