import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('appointments');
  const [profileForm, setProfileForm] = useState({
    specialization: '', experience: '', consultationFee: '', hospital: '', bio: '',
    city: '', state: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptRes, profRes] = await Promise.allSettled([
        api.get('/appointments/doctor'),
        api.get('/doctors/me'),
      ]);
      if (apptRes.status === 'fulfilled') setAppointments(apptRes.value.data);
      if (profRes.status === 'fulfilled') {
        const p = profRes.value.data;
        setProfile(p);
        setProfileForm({
          specialization: p.specialization || '',
          experience: p.experience || '',
          consultationFee: p.consultationFee || '',
          hospital: p.hospital || '',
          bio: p.bio || '',
          city: p.address?.city || '',
          state: p.address?.state || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id, status, notes = '') => {
    try {
      await api.put(`/appointments/${id}`, { status, notes });
      toast.success(`Appointment ${status}`);
      fetchData();
    } catch {
      toast.error('Update failed');
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        specialization: profileForm.specialization,
        experience: profileForm.experience,
        consultationFee: profileForm.consultationFee,
        hospital: profileForm.hospital,
        bio: profileForm.bio,
        address: { city: profileForm.city, state: profileForm.state },
      };
      if (profile) {
        await api.put(`/doctors/${profile._id}`, payload);
      } else {
        await api.post('/doctors', payload);
      }
      toast.success('Profile saved!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    today: appointments.filter(a => new Date(a.appointmentDate).toDateString() === new Date().toDateString()).length,
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1>Doctor Dashboard 👨‍⚕️</h1>
          <p>Welcome back, Dr. {user?.name}</p>
          {profile && !profile.isApproved && (
            <div className="approval-banner">⏳ Your profile is pending admin approval</div>
          )}
        </div>
      </div>

      <div className="container">
        <div className="stats-grid">
          {[
            { label: 'Total Appts', value: stats.total, color: '#2563eb', icon: '📅' },
            { label: 'Pending', value: stats.pending, color: '#f59e0b', icon: '⏳' },
            { label: "Today's", value: stats.today, color: '#10b981', icon: '📆' },
          ].map(s => (
            <div key={s.label} className="stat-card card">
              <span className="stat-icon">{s.icon}</span>
              <div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-name">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="tabs">
          {['appointments', 'profile'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'appointments' ? '📅 Appointments' : '👤 My Profile'}
            </button>
          ))}
        </div>

        {tab === 'appointments' && (
          loading ? <div className="loading">Loading...</div> :
          appointments.length === 0 ? (
            <div className="empty-state card"><p style={{ fontSize: '3rem' }}>📅</p><h3>No appointments yet</h3></div>
          ) : (
            <div className="appointments-list">
              {appointments.map(a => (
                <div key={a._id} className="appointment-card card">
                  <div className="appt-header">
                    <div>
                      <h4>{a.patient?.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.patient?.email}</p>
                    </div>
                    <span className={`badge badge-${a.status}`}>{a.status}</span>
                  </div>
                  <div className="appt-details">
                    <span>📅 {new Date(a.appointmentDate).toLocaleDateString()}</span>
                    <span>🕐 {a.timeSlot?.startTime} - {a.timeSlot?.endTime}</span>
                    <span>💰 ₹{a.consultationFee}</span>
                  </div>
                  <p className="appt-reason">📝 {a.reason}</p>
                  {a.status === 'pending' && (
                    <div className="appt-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => updateAppointment(a._id, 'confirmed')}>✅ Confirm</button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateAppointment(a._id, 'cancelled')}>❌ Cancel</button>
                    </div>
                  )}
                  {a.status === 'confirmed' && (
                    <button className="btn btn-primary btn-sm" onClick={() => updateAppointment(a._id, 'completed')}>
                      Mark Completed
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'profile' && (
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Update Profile</h3>
            <form onSubmit={saveProfile}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Specialization</label>
                  <input className="form-control" value={profileForm.specialization}
                    onChange={e => setProfileForm({ ...profileForm, specialization: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Years of Experience</label>
                  <input className="form-control" type="number"
                    value={profileForm.experience}
                    onChange={e => setProfileForm({ ...profileForm, experience: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Consultation Fee (₹)</label>
                  <input className="form-control" type="number"
                    value={profileForm.consultationFee}
                    onChange={e => setProfileForm({ ...profileForm, consultationFee: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Hospital/Clinic</label>
                  <input className="form-control" value={profileForm.hospital}
                    onChange={e => setProfileForm({ ...profileForm, hospital: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input className="form-control" value={profileForm.city}
                    onChange={e => setProfileForm({ ...profileForm, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input className="form-control" value={profileForm.state}
                    onChange={e => setProfileForm({ ...profileForm, state: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea className="form-control" rows={4} value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} />
              </div>
              <button className="btn btn-primary">Save Profile</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
