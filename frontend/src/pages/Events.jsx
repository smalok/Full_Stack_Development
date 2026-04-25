import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/api';
import { Calendar, MapPin, Search, X } from 'lucide-react';

const departments = ['CSE', 'AI & Data Science', 'AI & Machine Learning', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Aeronautical', 'Biotechnology', 'Information Technology', 'MBA', 'Science & Humanities'];
const eventTypes = ['Workshop', 'Seminar', 'Hackathon', 'Cultural', 'Sports', 'Guest Lecture', 'Tech Fest'];
const badgeClass = (t) => 'badge badge-' + (t || '').toLowerCase().replace(/\s+/g, '-');
const stripeColor = { Workshop: '#3B82F6', Seminar: '#7C3AED', Hackathon: '#059669', Cultural: '#D97706', Sports: '#DC2626', 'Guest Lecture': '#0D9488', 'Tech Fest': '#4338CA' };

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ department: '', eventType: '', status: '', search: '' });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.department) params.department = filters.department;
      if (filters.eventType) params.eventType = filters.eventType;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      const res = await getEvents(params);
      setEvents(res.data?.data || []);
    } catch { setEvents([]); }
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, [filters.department, filters.eventType, filters.status]);

  const handleSearch = (e) => { e.preventDefault(); fetchEvents(); };
  const clearFilters = () => setFilters({ department: '', eventType: '', status: '', search: '' });

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>All Campus Events</h1>
          <p>Find and register for events across all departments</p>
          <form onSubmit={handleSearch} style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--slate)' }} />
              <input className="form-control" placeholder="Search events..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} style={{ paddingLeft: 38 }} />
            </div>
            <button className="btn btn-primary" type="submit">Search</button>
          </form>
        </div>
      </div>

      <section className="section">
        <div className="filter-bar">
          <select className="form-control" style={{ width: 'auto' }} value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value })}>
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="form-control" style={{ width: 'auto' }} value={filters.eventType} onChange={e => setFilters({ ...filters, eventType: e.target.value })}>
            <option value="">All Types</option>
            {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="form-control" style={{ width: 'auto' }} value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
          {(filters.department || filters.eventType || filters.status || filters.search) && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}><X size={14} /> Clear Filters</button>
          )}
        </div>
        <p style={{ color: 'var(--slate)', marginBottom: 16 }}>Showing {events.length} events</p>
        {loading ? <div className="loader"><div className="spinner" /></div> : (
          <div className="event-grid">
            {events.map(e => (
              <Link to={`/events/${e.id}`} key={e.id} className="card" style={{ textDecoration: 'none' }}>
                <div className="card-stripe" style={{ background: stripeColor[e.eventType] || '#3B82F6' }} />
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={badgeClass(e.eventType)}>{e.eventType}</span>
                    <span className={`badge badge-${(e.status || '').toLowerCase()}`}>{e.status}</span>
                  </div>
                  <h3 className="card-title" style={{ marginTop: 8 }}>{e.title}</h3>
                  <div className="card-meta">
                    <span><Calendar size={14} /> {e.eventDate}</span>
                    <span><MapPin size={14} /> {e.venue}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--slate)' }}>{e.department}</p>
                  <div style={{ margin: '12px 0' }}>
                    <span style={{ fontSize: 13 }}>{e.currentRegistrations}/{e.maxCapacity} registered</span>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${(e.currentRegistrations / e.maxCapacity) * 100}%` }} /></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {!loading && events.length === 0 && <div className="empty-state"><h3>No events found</h3><p>Try different filters or search terms.</p></div>}
      </section>
    </>
  );
}
