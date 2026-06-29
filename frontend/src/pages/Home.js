import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const specializations = [
  { name: 'Cardiology', icon: '❤️' },
  { name: 'Dermatology', icon: '🧴' },
  { name: 'Pediatrics', icon: '👶' },
  { name: 'Orthopedics', icon: '🦴' },
  { name: 'Neurology', icon: '🧠' },
  { name: 'Ophthalmology', icon: '👁️' },
];

const features = [
  { icon: '🔍', title: 'Find Doctors', desc: 'Search from hundreds of verified doctors by specialization or location.' },
  { icon: '📅', title: 'Easy Scheduling', desc: 'Book appointments in minutes with real-time availability.' },
  { icon: '📄', title: 'Document Upload', desc: 'Securely upload and share medical documents with your doctor.' },
  { icon: '🔔', title: 'Notifications', desc: 'Get reminders and updates about your appointments.' },
];

const Home = () => {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Your Health, <span>Our Priority</span></h1>
            <p>Connect with top-rated doctors, book appointments instantly, and manage your healthcare journey — all in one place.</p>
            <div className="hero-actions">
              <Link to="/doctors" className="btn btn-primary btn-lg">Find a Doctor</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Get Started</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <div className="hero-stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Verified Doctors</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Appointments</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Specializations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Browse by Specialization</h2>
          <div className="spec-grid">
            {specializations.map((s) => (
              <Link key={s.name} to={`/doctors?specialization=${s.name}`} className="spec-card">
                <span className="spec-icon">{s.icon}</span>
                <span className="spec-name">{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="grid-4">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to take control of your health?</h2>
          <p>Join thousands of patients who trust BookADoctor for their healthcare needs.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
