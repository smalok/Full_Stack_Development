import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUpcomingEvents, getEventStats } from '../services/api';
import { Calendar, MapPin, Search, Eye, ClipboardCheck, CheckCircle } from 'lucide-react';

const badgeClass = (type) => 'badge badge-' + (type || '').toLowerCase().replace(/\s+/g, '-');
const stripeColor = { Workshop: '#3B82F6', Seminar: '#7C3AED', Hackathon: '#059669', Cultural: '#D97706', Sports: '#DC2626', 'Guest Lecture': '#0D9488', 'Tech Fest': '#4338CA' };

export default function Landing() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    getUpcomingEvents().then(r => setEvents(r.data?.data || [])).catch(() => {});
    getEventStats().then(r => setStats(r.data?.data || {})).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Discover What's Happening on Campus</h1>
        <p>Browse workshops, seminars, hackathons, and more at Vel Tech University. Register in one click.</p>
        <div className="hero-btns">
          <Link to="/events" className="btn btn-primary btn-lg">Browse Events</Link>
          <Link to="/my-events" className="btn btn-secondary-nav btn-lg">View My Events</Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><h3>{stats.total || '50'}+</h3><p>Events</p></div>
          <div className="hero-stat"><h3>2K+</h3><p>Registrations</p></div>
          <div className="hero-stat"><h3>15+</h3><p>Departments</p></div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          <Link to="/events">View All →</Link>
        </div>
        <div className="event-grid">
          {events.slice(0, 6).map(e => (
            <div className="card" key={e.id}>
              <div className="card-stripe" style={{ background: stripeColor[e.eventType] || '#3B82F6' }} />
              <div className="card-body">
                <span className={badgeClass(e.eventType)}>{e.eventType}</span>
                <h3 className="card-title" style={{ marginTop: 8 }}>{e.title}</h3>
                <div className="card-meta">
                  <span><Calendar size={14} /> {e.eventDate}</span>
                  <span><MapPin size={14} /> {e.venue}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--slate)' }}>{e.department}</p>
                <div style={{ margin: '12px 0' }}>
                  <span style={{ fontSize: 13, color: 'var(--slate)' }}>{e.currentRegistrations}/{e.maxCapacity} registered</span>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${(e.currentRegistrations / e.maxCapacity) * 100}%` }} /></div>
                </div>
                <div className="card-footer">
                  <Link to={`/events/${e.id}`} className="btn btn-secondary btn-sm">View Details</Link>
                  <Link to={`/events/${e.id}`} className="btn btn-primary btn-sm">Register</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {events.length === 0 && <p className="text-center" style={{ color: 'var(--slate)', padding: 40 }}>Loading events...</p>}
      </section>

      <section className="section-gray">
        <div className="steps">
          <div className="step"><div className="step-icon"><Search size={28} /></div><h4>Browse Events</h4><p>Find events across all departments</p></div>
          <div className="step"><div className="step-icon"><Eye size={28} /></div><h4>View Details</h4><p>Check dates, venue & speakers</p></div>
          <div className="step"><div className="step-icon"><ClipboardCheck size={28} /></div><h4>Register</h4><p>Fill the form in seconds</p></div>
          <div className="step"><div className="step-icon"><CheckCircle size={28} /></div><h4>Get Confirmed</h4><p>Receive instant confirmation</p></div>
        </div>
      </section>
    </>
  );
}
