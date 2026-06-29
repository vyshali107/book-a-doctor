import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './BookAppointment.css';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    appointmentDate: '',
    startTime: '',
    endTime: '',
    reason: '',
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await api.get(`/doctors/${doctorId}`);
        setDoctor(data);
      } catch {
        toast.error('Doctor not found');
        navigate('/doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startTime || !form.endTime) {
      return toast.error('Please enter a time slot');
    }
    setSubmitting(true);
    try {
      await api.post('/appointments', {
        doctorId,
        appointmentDate: form.appointmentDate,
        timeSlot: { startTime: form.startTime, endTime: form.endTime },
        reason: form.reason,
      });
      toast.success('Appointment booked successfully!');
      navigate('/patient/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="book-page">
      <div className="container">
        <div className="book-grid">
          {/* Doctor Summary */}
          <div className="card doctor-summary">
            <h3>Booking with</h3>
            <div className="summary-doc">
              <div className="summary-avatar">{doctor?.user?.name?.charAt(0)}</div>
              <div>
                <h4>Dr. {doctor?.user?.name}</h4>
                <p>{doctor?.specialization}</p>
              </div>
            </div>
            <div className="summary-fee">
              <span>Consultation Fee</span>
              <strong>₹{doctor?.consultationFee}</strong>
            </div>
            {doctor?.availableSlots?.length > 0 && (
              <div className="available-slots">
                <h4>Available Slots</h4>
                {doctor.availableSlots.filter(s => !s.isBooked).map((s, i) => (
                  <div key={i} className="slot-item"
                    onClick={() => setForm({ ...form, startTime: s.startTime, endTime: s.endTime })}>
                    <strong>{s.day}</strong> — {s.startTime} to {s.endTime}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="card">
            <h2>Book Appointment</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Appointment Date</label>
                <input className="form-control" type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                  required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Start Time</label>
                  <input className="form-control" type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    required />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input className="form-control" type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    required />
                </div>
              </div>
              <div className="form-group">
                <label>Reason for Visit</label>
                <textarea className="form-control" rows={4}
                  placeholder="Describe your symptoms or reason for the appointment..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  required />
              </div>
              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Booking...' : '📅 Confirm Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
