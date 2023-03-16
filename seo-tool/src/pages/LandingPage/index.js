import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <main className="flex-grow">
      <section className="hero-section bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Steigere deine Website mit Optimizemate
          </h1>
          <p className="text-xl mb-8">
            Entdecke unser leistungsstarkes SEO-Tool, um dein Online-Ranking zu
            verbessern.
          </p>
          <button className="bg-white text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
            Jetzt starten
          </button>
        </div>
      </section>

      <section className="features-section py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Unsere Funktionen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <i className="fas fa-search text-4xl mb-4"></i>
              <h3 className="text-2xl font-bold mb-4">Keyword-Recherche</h3>
              <p>
                Finde die besten Keywords für deine Website, um in den
                Suchergebnissen aufzusteigen.
              </p>
            </div>
            <div className="text-center">
              <i className="fas fa-chart-line text-4xl mb-4"></i>
              <h3 className="text-2xl font-bold mb-4">Rank-Tracking</h3>
              <p>
                Verfolge und analysiere deine Suchmaschinenplatzierungen für
                einen besseren Überblick.
              </p>
            </div>
            <div className="text-center">
              <i className="fas fa-link text-4xl mb-4"></i>
              <h3 className="text-2xl font-bold mb-4">Backlink-Analyse</h3>
              <p>
                Analysiere und optimiere dein Backlink-Profil für ein besseres
                Ranking.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonial-section py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Das sagen unsere Kunden
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="italic mb-4">
                "Optimizemate hat meiner Website geholfen, schnell in den
                Suchergebnissen aufzusteigen. Ich kann es nur empfehlen!"
              </p>
              <h4 className="font-bold text-xl">Max Mustermann</h4>
              <p className="text-gray-600">Geschäftsführer, Mustermann GmbH</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="italic mb-4">
                "Die Tools und Funktionen von Optimizemate sind einfach zu
                bedienen und haben meine SEO-Strategie verbessert."
              </p>
              <h4 className="font-bold text-xl">Erika Musterfrau</h4>
              <p className="text-gray-600">
                Marketing Managerin, Musterfrau AG
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="pricing-section py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Preisgestaltung
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold mb-4">Basis</h3>
              <p className="text-4xl mb-6">
                €29<span className="text-gray-600 text-xl">/Monat</span>
              </p>
              <ul className="mb-6">
                <li>5 Projekte</li>
                <li>50 Keywords</li>
                <li>10.000 Seiten-Crawl</li>
                <li>Email-Support</li>
              </ul>
              <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-500 transition-colors">
                Jetzt wählen
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-4xl mb-6">
                €79<span className="text-gray-600 text-xl">/Monat</span>
              </p>
              <ul className="mb-6">
                <li>25 Projekte</li>
                <li>250 Keywords</li>
                <li>50.000 Seiten-Crawl</li>
                <li>Live-Chat Support</li>
              </ul>
              <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-500 transition-colors">
                Jetzt wählen
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <p className="text-4xl mb-6">
                €199<span className="text-gray-600 text-xl">/Monat</span>
              </p>
              <ul className="mb-6">
                <li>Unbegrenzte Projekte</li>
                <li>Unbegrenzte Keywords</li>
                <li>Unbegrenzter Seiten-Crawl</li>
                <li>Priorisierter Support</li>
              </ul>
              <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-500 transition-colors">
                Jetzt wählen
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="cta-section py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bereit für ein besseres Ranking?
          </h2>
          <p className="text-xl mb-8">
            Registriere dich noch heute für Optimizemate und bringe deine
            Website auf ein neues Level.
          </p>
          <button className="bg-white text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
            Jetzt starten
          </button>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
