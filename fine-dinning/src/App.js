import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import "./App.css";

import "./App.css";

const RESTAURANTS = [
  {
    id: "belcanto",
    name: "Belcanto",
    chef: "José Avillez",

   
   
    address: "R. Serpa Pinto 10A, 1200-026 Lisboa",
    coords: [38.7100898, -9.1414618],
    img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/a3/09/00/dining-room.jpg?w=900&h=-1&s=1",
    dishes: [
      { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/98/45/a7/caption.jpg?w=1000&h=-1&s=1", name: "Prato Luxo 1" },
      { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/20/11/b3/the-worlds-best-50.jpg?w=1000&h=-1&s=1", name: "Prato Luxo 2" }
    ]
  },
  {
    id: "alma",
    name: "Alma ",
    chef: "Henrique Sá Pessoa",

    address: "Rua Anchieta 15 Chiado, Lisboa 1200-023 Portugal",
    coords: [38.7089, -9.1410],
    img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/b4/44/ab/um-convite-para-viver.jpg?w=1000&h=-1&s=1",
    dishes: [
      { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/b4/46/51/ervilha-coco-e-bulhao.jpg?w=1000&h=-1&s=1", name: "Prato Luxo 1" },
      { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/b4/46/12/lavagante-alho-frances.jpg?w=1000&h=-1&s=1", name: "Prato Luxo 2" }
    ]
  },
  {
    id: "feitoria",
    name: "Antiqvvm",
    chef: "Vítor Matos",
    
    address: "Rua De Entre-Quintas 220, Porto 4050-240 Portugal",
    coords: [38.693333, -9.210556],
    img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/82/8f/a0/le-restaurant.jpg?w=1000&h=-1&s=1",
    dishes: [
      { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/31/1a/bb/8d/caption.jpg?w=1000&h=-1&s=1", name: "Prato Luxo 1" },
      { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/31/18/96/b1/caption.jpg?w=1000&h=-1&s=1", name: "Prato Luxo 2" }
    ]
  },
  {
    id: "vilajoya",
    name: "Ocean Restaurant",
    chef: "Hans Neuner",
    
    address: "R. Anneliese Pohl Vila Vita Parc, Porches 8400-450 Portugal",
    coords: [37.07996, -8.31379],
    img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/37/84/20/the-dining-room-is-well.jpg?w=1000&h=-1&s=1",
    dishes: [
      { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/cb/af/67/caption.jpg?w=1000&h=-1&s=1", name: "Prato Luxo 1" },
      { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/59/09/d9/caption.jpg?w=1000&h=-1&s=1", name: "Prato Luxo 2" }
    ]
  },
  {
    id: "vilaandorinha",
    name: "The Yeatman",
    chef: "Ana Silva",
   
    address: "Rua de Choupelo, Vila Nova de Gaia 4400-088 Portugal",
    coords: [41.14961, -8.611],
    img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/e2/dd/ab/the-yeatman-gastronomic.jpg?w=900&h=500&s=1",
    dishes: [
      { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/31/33/19/fa/caption.jpg?w=600&h=-1&s=1", name: "Prato Luxo 1" },
      { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2f/d6/d5/90/caption.jpg?w=1000&h=-1&s=1", name: "Prato Luxo 2" }
    ]
  },
   {
    id: "vilaandorinha",
    name: "Arkhe",
    chef: "João Ricardo Alves",
   
    address: "Rua São Filipe Neri 14, Lisboa 1250-227 Portugal",
    coords: [41.14961, -8.611],
    img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/60/da/21/caption.jpg?w=1000&h=-1&s=1",
    dishes: [
      { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/eb/c1/37/caption.jpg?w=1000&h=-1&s=1", name: "Prato Luxo 1" },
      { img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/ea/0e/c3/caption.jpg?w=1000&h=-1&s=1", name: "Prato Luxo 2" }
    ]
  }
];

export default function App() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState("");
  const [filters, setFilters] = useState({ city: "All", type: "All", stars: "All" });
  const [searchTerm, setSearchTerm] = useState("");
  const audioRef = useRef(null);

  const filteredRestaurants = RESTAURANTS.filter((r) => {
    const cityMatch = filters.city === "All" || r.city === filters.city;
    const typeMatch = filters.type === "All" || r.type === filters.type;
    const starsMatch = filters.stars === "All" || r.stars === parseInt(filters.stars);
    const searchMatch =
      searchTerm.trim() === "" ||
      r.dishes.some((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return cityMatch && typeMatch && starsMatch && searchMatch;
  });

  useEffect(() => {
    const cards = document.querySelectorAll(".restaurant-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.3 }
    );
    cards.forEach((card) => observer.observe(card));
  }, [filteredRestaurants]);

  const openLightbox = (img) => { setLightboxImg(img); setLightboxOpen(true); };
  const closeLightbox = () => { setLightboxOpen(false); setLightboxImg(""); };

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div onClick={startMusic}>
      {/* Vídeo de fundo fixo */}
    
      {/* Música de fundo */}
      <audio ref={audioRef} src="/musica1.mp3" loop />

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Fine Dining</div>
        <div>
          <a href="#hero">Início</a>
          <a href="#concept">Conceito</a>
   
          <a href="#restaurants">Restaurantes</a>
          <a href="#map">Mapa</a>
        </div>
      </nav>
<div className="content">
      {/* Hero */}
      <header id="hero" className="hero">
        <div className="hero-video-container">
          <video
            className="hero-video"
            src="/culinaria.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
         
        </div>

        <h1>Fine Dining</h1>
        <p>A luxúria num prato</p>
      </header>

    <div className="secondary-background-video">
  <video
    className="secondary-video"
    src="/video2.mp4"
    autoPlay
    loop
    muted
    playsInline
  />
  <div className="secondary-overlay"></div>
</div>

      
<section  id="concept" className="intro-text">
  <center>
  <h2>Definição de Fine Dining</h2>
  
  <p>
  Fine dining, ou jantar requintado, é uma experiência gastronómica luxuosa, formal e sofisticada em restaurantes que se destacam pela alta qualidade dos ingredientes, pratos criativos, serviço impecável, atmosfera elegante e o uso de talheres, cristais e toalhas de mesa finas. A experiência é uma celebração de luxo e atenção aos detalhes, que se estende do ambiente até a apresentação da comida e o atendimento dos funcionários, sendo o mais caro dos conceitos de restaurante.
  </p></center>
</section>

    

      {/* Restaurantes */}
      <section id="restaurants" className="restaurants">
        {filteredRestaurants.length === 0 ? (
          <p className="no-results">Nenhum restaurante corresponde à pesquisa.</p>
        ) : (
          filteredRestaurants.map((r) => (
            <div key={r.id} className="restaurant-card">
              <img src={r.img} alt={r.name} onClick={() => openLightbox(r.img)} />
              <div className="restaurant-card-content">
                <h3>{r.name}</h3>
                <p>Chefe: <strong>{r.chef}</strong></p>
                
               <p>
  <FaMapMarkerAlt style={{ color: "#cfa15b", marginRight: "8px" }} />
  {r.address}
</p>

                <div className="dish-carousel">
                  {r.dishes.map((d, idx) => (
                    <img
                      key={idx}
                      src={d.img}
                      alt={d.name}
                      title={d.name}
                      onClick={() => openLightbox(d.img)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </section>
      </div>

      {/* Lightbox */}
      <div className={`lightbox ${lightboxOpen ? "open" : ""}`} onClick={closeLightbox}>
        {lightboxImg && <img src={lightboxImg} alt="Prato" />}
      </div>

    </div>
  );
}
