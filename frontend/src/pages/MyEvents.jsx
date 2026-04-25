import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyRegistrations, cancelRegistration, submitFeedback, checkFeedback } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, X } from 'lucide-react';

const stripeColor = { Workshop: '#3B82F6', Seminar: '#7C3AED', Hackathon: '#059669', Cultural: '#D97706', Sports: '#DC2626', 'Guest Lecture': '#0D9488', 'Tech Fest': '#4338CA' };

export default function MyEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!user) { navigate('/login'); return; } fetchRegs(); }, [user]);
  const fetchRegs = async () => { try { const r = await getMyRegistrations(); setRegistrations(r.data?.data || []); } catch {} setLoading(false); };

  const filtered = registrations.filter(r => {
    if (tab === 'upcoming') return r.status === 'CONFIRMED' && r.event?.status === 'UPCOMING';
    if (tab === 'completed') return r.event?.status === 'COMPLETED';
    return true;
  });

  const handleCancel = async (regId) => {
    if (!window.confirm('Cancel this registration?')) return;
    try { await cancelRegistration(regId); toast.success('Registration cancelled'); fetchRegs(); } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      await submitFeedback({ eventId: feedbackModal.event.id, rating, comment });
      toast.success('✅ Feedback submitted!');
      setFeedbackModal(null); setRating(0); setComment('');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit'); }
    setSubmitting(false);
  };

  const upcoming = registrations.filter(r => r.status !== 'CANCELLED' && r.event?.status === 'UPCOMING').length;
  const completed = registrations.filter(r => r.event?.status === 'COMPLETED').length;

  if (loading) return <div className="loader" style={{ marginTop: 120 }}><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header"><div className="container"><h1>My Events</h1><p>Track your registrations and give feedback</p></div></div>
      <section className="section">
        <div className="stats-row">
          <div className="stat-card"><h3>{registrations.length}</h3><p>Registered</p></div>
          <div className="stat-card"><h3>{upcoming}</h3><p>Upcoming</p></div>
          <div className="stat-card"><h3>{completed}</h3><p>Completed</p></div>
        </div>

        <div className="tabs">
          <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All ({registrations.length})</button>
          <button className={`tab ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>Upcoming ({upcoming})</button>
          <button className={`tab ${tab === 'completed' ? 'active' : ''}`} onClick={() => setTab('completed')}>Completed ({completed})</button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><h3>No events here</h3><p>Browse upcoming events and register!</p><Link to="/events" className="btn btn-primary">Browse Events</Link></div>
        ) : filtered.map(reg => (
          <div className="reg-card" key={reg.id}>
            <div className="reg-stripe" style={{ background: stripeColor[reg.event?.eventType] || '#3B82F6' }} />
            <div className="reg-info">
              <h4>{reg.event?.title}</h4>
              <div className="reg-meta">
                <span><Calendar size={13} /> {reg.event?.eventDate}</span>
                <span><Clock size={13} /> {reg.event?.startTime} - {reg.event?.endTime}</span>
                <span><MapPin size={13} /> {reg.event?.venue}</span>
              </div>
              <div style={{ marginTop: 6 }}>
                <span className={`badge badge-${reg.status?.toLowerCase()}`}>{reg.status}</span>
                {reg.event?.status === 'COMPLETED' && <span className="badge badge-completed" style={{ marginLeft: 6 }}>Completed</span>}
              </div>
            </div>
            <div className="reg-actions">
              <Link to={`/events/${reg.event?.id}`} className="btn btn-secondary btn-sm">View</Link>
              {reg.status === 'CONFIRMED' && reg.event?.status === 'UPCOMING' && (
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleCancel(reg.id)}>Cancel</button>
              )}
              {reg.event?.status === 'COMPLETED' && reg.status !== 'CANCELLED' && (
                <button className="btn btn-primary btn-sm" onClick={() => setFeedbackModal(reg)}>Give Feedback</button>
              )}
            </div>
          </div>
        ))}
      </section>

      {feedbackModal && (
        <div className="modal-overlay" onClick={() => setFeedbackModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Rate: {feedbackModal.event?.title}</h3>
              <button className="icon-btn" onClick={() => setFeedbackModal(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleFeedback}>
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <div className="stars">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`star ${s <= rating ? 'filled' : ''}`} onClick={() => setRating(s)}>★</span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Your Comment</label>
                <textarea className="form-control" placeholder="Share your experience..." value={comment} onChange={e => setComment(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setFeedbackModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Feedback'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
