import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventById, registerForEvent, checkRegistration } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, Users, Tag, CheckCircle } from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEventById(id);
        setEvent(res.data?.data?.event || res.data?.data);
        if (user) {
          const regRes = await checkRegistration(id);
          setIsRegistered(regRes.data?.data?.isRegistered || false);
        }
      } catch { toast.error('Event not found'); }
      setLoading(false);
    };
    fetchData();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) { navigate('/login'); return; }
    setRegistering(true);
    try {
      await registerForEvent(id);
      toast.success('✅ Registered Successfully!');
      setIsRegistered(true);
      setEvent(prev => ({ ...prev, currentRegistrations: (prev.currentRegistrations || 0) + 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setRegistering(false);
  };

  if (loading) return <div className="loader" style={{ marginTop: 120 }}><div className="spinner" /></div>;
  if (!event) return <div className="empty-state" style={{ marginTop: 120 }}><h3>Event not found</h3></div>;

  const speakers = event.speakers?.split(',').map(s => s.trim()) || [];
  const designations = event.speakerDesignations?.split(',').map(s => s.trim()) || [];

  return (
    <>
      <div className="detail-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> → <Link to="/events">Events</Link> → {event.title}</div>
          <span className={'badge badge-' + (event.eventType || '').toLowerCase().replace(/\s+/g, '-')}>{event.eventType}</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '12px 0' }}>{event.title}</h1>
          <p style={{ opacity: 0.8 }}>{event.department}</p>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <h2 style={{ marginBottom: 16 }}>About This Event</h2>
          <p style={{ lineHeight: 1.8, marginBottom: 32 }}>{event.description}</p>

          {speakers.length > 0 && speakers[0] && (
            <>
              <h3 style={{ marginBottom: 16 }}>Speakers</h3>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
                {speakers.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--gray-bg)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{s[0]}</div>
                    <div><div style={{ fontWeight: 600 }}>{s}</div><div style={{ fontSize: 13, color: 'var(--slate)' }}>{designations[i] || ''}</div></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="detail-sidebar">
          <div className="card">
            <div className="card-body">
              <h3 style={{ marginBottom: 16 }}>Event Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Calendar size={18} color="var(--slate)" /><div><div style={{ fontSize: 13, color: 'var(--slate)' }}>Date</div><div style={{ fontWeight: 600 }}>{event.eventDate}</div></div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Clock size={18} color="var(--slate)" /><div><div style={{ fontSize: 13, color: 'var(--slate)' }}>Time</div><div style={{ fontWeight: 600 }}>{event.startTime} - {event.endTime}</div></div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><MapPin size={18} color="var(--slate)" /><div><div style={{ fontSize: 13, color: 'var(--slate)' }}>Venue</div><div style={{ fontWeight: 600 }}>{event.venue}</div></div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Tag size={18} color="var(--slate)" /><div><div style={{ fontSize: 13, color: 'var(--slate)' }}>Type</div><div style={{ fontWeight: 600 }}>{event.eventType}</div></div></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Users size={18} color="var(--slate)" /><div style={{ flex: 1 }}><div style={{ fontSize: 13, color: 'var(--slate)' }}>Capacity</div><div style={{ fontWeight: 600 }}>{event.currentRegistrations}/{event.maxCapacity} registered</div><div className="progress-bar" style={{ marginTop: 4 }}><div className="progress-fill" style={{ width: `${(event.currentRegistrations / event.maxCapacity) * 100}%` }} /></div></div></div>
              </div>
              <div style={{ margin: '16px 0', padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 600, color: event.isFree ? 'var(--green)' : 'var(--charcoal)' }}>{event.isFree ? '✅ Free Event' : `₹${event.fee}`}</span>
              </div>
              {isRegistered ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#D1FAE5', borderRadius: 'var(--radius-sm)', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={18} /> You are registered!</div>
              ) : (
                <button className="btn btn-primary btn-block btn-lg" onClick={handleRegister} disabled={registering || event.status === 'COMPLETED' || event.status === 'CANCELLED'}>
                  {registering ? 'Registering...' : event.status === 'COMPLETED' ? 'Event Completed' : 'Register for this Event'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
