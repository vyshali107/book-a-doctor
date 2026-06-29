import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docFile, setDocFile] = useState(null);
  const [uploadingFor, setUploadingFor] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/my');
      setAppointments(data);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch {
      toast.error('Cancel failed');
    }
  };

  const uploadDoc = async (appointmentId) => {
    if (!docFile) return toast.error('Select a file first');
    const formData = new FormData();
    formData.append('document', docFile);
    try {
      await api.post(`/documents/${appointmentId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Document uploaded!');
      setDocFile(null);
      setUploadingFor(null);
    } catch {
      toast.error('Upload failed');
    }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Manage your appointments and health records</p>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total', value: stats.total, color: '#2563eb', icon: '📅' },
            { label: 'Pending', value: stats.pending, color: '#f59e0b', icon: '⏳' },
            { label: 'Confirmed', value: stats.confirmed, color: '#10b981', icon: '✅' },
            { label: 'Completed', value: stats.completed, color: '#6366f1', icon: '🎉' },
          ].map((s) => (
            <div key={s.label} className="stat-card card">
              <span className="stat-icon">{s.icon}</span>
              <div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-name">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-header">
          <h2>My Appointments</h2>
          <Link to="/doctors" className="btn btn-primary btn-sm">+ Book New</Link>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="empty-state card">
            <p style={{ fontSize: '3rem' }}>📅</p>
            <h3>No appointments yet</h3>
            <Link to="/doctors" className="btn btn-primary" style={{ marginTop: '1rem' }}>Find a Doctor</Link>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map((a) => (
              <div key={a._id} className="appointment-card card">
                <div className="appt-header">
                  <div>
                    <h4>Dr. {a.doctor?.user?.name}</h4>
                    <p className="appt-spec">{a.doctor?.specialization}</p>
                  </div>
                  <span className={`badge badge-${a.status}`}>{a.status}</span>
                </div>
                <div className="appt-details">
                  <span>📅 {new Date(a.appointmentDate).toLocaleDateString()}</span>
                  <span>🕐 {a.timeSlot?.startTime} - {a.timeSlot?.endTime}</span>
                  <span>💰 ₹{a.consultationFee}</span>
                </div>
                <p className="appt-reason">📝 {a.reason}</p>
                {a.notes && <p className="appt-notes">🩺 Doctor note: {a.notes}</p>}

                <div className="appt-actions">
                  {a.status === 'pending' && (
                    <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(a._id)}>
                      Cancel
                    </button>
                  )}
                  <button className="btn btn-outline btn-sm"
                    onClick={() => setUploadingFor(uploadingFor === a._id ? null : a._id)}>
                    📎 Upload Doc
                  </button>
                </div>

                {uploadingFor === a._id && (
                  <div className="upload-section">
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => setDocFile(e.target.files[0])} />
                    <button className="btn btn-secondary btn-sm" onClick={() => uploadDoc(a._id)}>
                      Upload
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
