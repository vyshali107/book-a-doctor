import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './DoctorDetail.css';

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await api.get(`/doctors/${id}`);
        setDoctor(data);
      } catch (err) {
        toast.error('Doctor not found');
        navigate('/doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!doctor) return null;

  return (
    <div className="doctor-detail-page">
      <div className="container">
        <div className="detail-grid">
          {/* Left: Profile */}
          <div>
            <div className="card profile-card">
              <div className="profile-avatar">
                <div className="avatar-placeholder" style={{ width: '120px', height: '120px', fontSize: '3rem', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  {doctor.user?.name?.charAt(0)}
                </div>
                <h2>Dr. {doctor.user?.name}</h2>
                <p className="spec-tag">{doctor.specialization}</p>
                <div className="profile-meta">
                  <span>⭐ {doctor.rating?.toFixed(1) || '4.5'} ({doctor.numReviews || 0} reviews)</span>
                  <span>🏆 {doctor.experience} yrs exp</span>
                </div>
              </div>

              <div className="profile-fee">
                <span className="fee-label">Consultation Fee</span>
                <span className="fee-amount">₹{doctor.consultationFee}</span>
              </div>

              {user?.role === 'patient' ? (
                <Link to={`/book/${doctor._id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  📅 Book Appointment
                </Link>
              ) : !user ? (
                <Link to="/login" className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
                  Login to Book
                </Link>
              ) : null}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            {doctor.bio && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3>About</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginTop: '0.75rem' }}>{doctor.bio}</p>
              </div>
            )}

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3>Details</h3>
              <div className="details-list">
                {doctor.hospital && <div className="detail-row"><span>🏥 Hospital</span><span>{doctor.hospital}</span></div>}
                {doctor.address?.city && <div className="detail-row"><span>📍 Location</span><span>{doctor.address.city}, {doctor.address.state}</span></div>}
                <div className="detail-row"><span>📧 Email</span><span>{doctor.user?.email}</span></div>
                {doctor.user?.phone && <div className="detail-row"><span>📞 Phone</span><span>{doctor.user.phone}</span></div>}
              </div>
            </div>

            {doctor.qualifications?.length > 0 && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3>Qualifications</h3>
                <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem' }}>
                  {doctor.qualifications.map((q, i) => (
                    <li key={i} style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {doctor.availableSlots?.length > 0 && (
              <div className="card">
                <h3>Available Slots</h3>
                <div className="slots-grid">
                  {doctor.availableSlots.map((slot, i) => (
                    <div key={i} className={`slot-badge ${slot.isBooked ? 'booked' : 'available'}`}>
                      <strong>{slot.day}</strong>
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
