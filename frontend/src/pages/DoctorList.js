import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import './DoctorList.css';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const specialization = searchParams.get('specialization') || '';
    fetchDoctors(specialization);
  }, [searchParams]);

  const fetchDoctors = async (specialization = '') => {
    try {
      const params = {};
      if (specialization) params.specialization = specialization;
      const { data } = await api.get('/doctors', { params });
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = doctors.filter(
    (d) =>
      d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Find Your Doctor</h1>
          <p>Browse verified healthcare professionals</p>
          <div className="search-bar">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        {loading ? (
          <div className="loading">Loading doctors...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '3rem' }}>🔍</p>
            <h3>No doctors found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          <div className="doctors-grid">
            {filtered.map((doctor) => (
              <div key={doctor._id} className="doctor-card card">
                <div className="doctor-avatar">
                  {doctor.user?.profileImage ? (
                    <img src={doctor.user.profileImage} alt={doctor.user.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {doctor.user?.name?.charAt(0) || 'D'}
                    </div>
                  )}
                </div>
                <div className="doctor-info">
                  <h3>Dr. {doctor.user?.name}</h3>
                  <p className="doctor-spec">{doctor.specialization}</p>
                  <p className="doctor-exp">🏆 {doctor.experience} years experience</p>
                  {doctor.hospital && <p className="doctor-hospital">🏥 {doctor.hospital}</p>}
                  {doctor.address?.city && (
                    <p className="doctor-location">📍 {doctor.address.city}</p>
                  )}
                  <div className="doctor-footer">
                    <span className="doctor-fee">₹{doctor.consultationFee}</span>
                    <div className="doctor-rating">
                      ⭐ {doctor.rating?.toFixed(1) || '4.5'}
                    </div>
                  </div>
                  <Link to={`/doctors/${doctor._id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;
