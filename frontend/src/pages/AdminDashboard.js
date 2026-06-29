import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [s, u, d, a] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/doctors'),
        api.get('/appointments'),
      ]);
      setStats(s.data);
      setUsers(u.data);
      setDoctors(d.data);
      setAppointments(a.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const approveDoctor = async (id, approve) => {
    try {
      await api.put(`/admin/doctors/${id}/approve`, { isApproved: approve });
      toast.success(`Doctor ${approve ? 'approved' : 'rejected'}`);
      fetchAll();
    } catch {
      toast.error('Action failed');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchAll();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="container">
          <h1>Admin Dashboard 🛡️</h1>
          <p>Manage the entire BookADoctor platform</p>
        </div>
      </div>

      <div className="container">
        <div className="stats-grid">
          {[
            { label: 'Patients', value: stats.totalUsers, color: '#2563eb', icon: '🧑‍⚕️' },
            { label: 'Doctors', value: stats.totalDoctors, color: '#10b981', icon: '👨‍⚕️' },
            { label: 'Pending Doctors', value: stats.pendingDoctors, color: '#f59e0b', icon: '⏳' },
            { label: 'Appointments', value: stats.totalAppointments, color: '#6366f1', icon: '📅' },
          ].map(s => (
            <div key={s.label} className="stat-card card">
              <span className="stat-icon">{s.icon}</span>
              <div>
                <div className="stat-value" style={{ color: s.color }}>{s.value ?? '...'}</div>
                <div className="stat-name">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="tabs">
          {['overview', 'doctors', 'users', 'appointments'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {loading ? <div className="loading">Loading...</div> : (
          <>
            {tab === 'doctors' && (
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Doctor Approvals</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th><th>Specialization</th><th>Experience</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map(d => (
                      <tr key={d._id}>
                        <td>Dr. {d.user?.name}</td>
                        <td>{d.specialization}</td>
                        <td>{d.experience} yrs</td>
                        <td>
                          <span className={`badge ${d.isApproved ? 'badge-confirmed' : 'badge-pending'}`}>
                            {d.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td>
                          {!d.isApproved ? (
                            <button className="btn btn-secondary btn-sm" onClick={() => approveDoctor(d._id, true)}>Approve</button>
                          ) : (
                            <button className="btn btn-danger btn-sm" onClick={() => approveDoctor(d._id, false)}>Revoke</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'users' && (
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>All Users</h3>
                <table>
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className="badge badge-confirmed">{u.role}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'appointments' && (
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>All Appointments</h3>
                <table>
                  <thead>
                    <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th>Fee</th></tr>
                  </thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a._id}>
                        <td>{a.patient?.name}</td>
                        <td>Dr. {a.doctor?.user?.name}</td>
                        <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                        <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                        <td>₹{a.consultationFee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'overview' && (
              <div className="grid-2">
                <div className="card">
                  <h3>Recent Doctors</h3>
                  {doctors.slice(0, 5).map(d => (
                    <div key={d._id} className="mini-row">
                      <span>Dr. {d.user?.name} — {d.specialization}</span>
                      <span className={`badge ${d.isApproved ? 'badge-confirmed' : 'badge-pending'}`}>
                        {d.isApproved ? '✓' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <h3>Recent Appointments</h3>
                  {appointments.slice(0, 5).map(a => (
                    <div key={a._id} className="mini-row">
                      <span>{a.patient?.name}</span>
                      <span className={`badge badge-${a.status}`}>{a.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
