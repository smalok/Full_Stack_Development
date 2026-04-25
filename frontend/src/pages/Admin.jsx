import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEvents, adminCreateEvent, adminUpdateEvent, adminDeleteEvent, adminGetRegistrations, adminExportExcel, adminGetStats } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Download, Users, Calendar, BarChart3, X, LayoutDashboard, CalendarDays, Eye } from 'lucide-react';

const departments = ['CSE', 'AI & Data Science', 'AI & Machine Learning', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Aeronautical', 'Biotechnology', 'Information Technology', 'MBA', 'Science & Humanities', 'All Departments', 'Physical Education', 'Administration'];
const eventTypes = ['Workshop', 'Seminar', 'Hackathon', 'Cultural', 'Sports', 'Guest Lecture', 'Tech Fest'];
const empty = { title: '', description: '', eventDate: '', startTime: '', endTime: '', venue: '', department: '', eventType: '', maxCapacity: 100, isFree: true, fee: 0, registrationDeadline: '', speakers: '', speakerDesignations: '', status: 'UPCOMING', imageUrl: '' };

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ ...empty });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [regsModal, setRegsModal] = useState(null);
  const [regs, setRegs] = useState([]);

  useEffect(() => { if (!user || !isAdmin()) navigate('/login'); else fetchData(); }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eRes, sRes] = await Promise.all([getEvents(), adminGetStats()]);
      setEvents(eRes.data?.data || []);
      setStats(sRes.data?.data || {});
    } catch {}
    setLoading(false);
  };

  const handleChange = (e) => { const { name, value, type, checked } = e.target; setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value })); };

  const openCreate = () => { setForm({ ...empty }); setEditId(null); setModal('form'); };
  const openEdit = (ev) => { setForm({ ...ev, startTime: ev.startTime?.substring(0, 5) || '', endTime: ev.endTime?.substring(0, 5) || '' }); setEditId(ev.id); setModal('form'); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) { await adminUpdateEvent(editId, form); toast.success('Event updated'); }
      else { await adminCreateEvent(form); toast.success('Event created'); }
      setModal(null); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event permanently?')) return;
    try { await adminDeleteEvent(id); toast.success('Deleted'); fetchData(); } catch { toast.error('Delete failed'); }
  };

  const viewRegs = async (ev) => {
    try { const r = await adminGetRegistrations(ev.id); setRegs(r.data?.data || []); setRegsModal(ev); } catch { toast.error('Failed to load'); }
  };

  const exportExcel = async (ev) => {
    try {
      const r = await adminExportExcel(ev.id);
      const blob = new Blob([r.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ev.title.replace(/[^a-zA-Z0-9]/g, '_')}_Registrations.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Excel downloaded');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Export failed');
    }
  };

  if (loading) return <div className="loader" style={{ marginTop: 120 }}><div className="spinner" /></div>;

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav className="admin-nav">
          <a className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}><LayoutDashboard size={18} /> Dashboard</a>
          <a className={view === 'events' ? 'active' : ''} onClick={() => setView('events')}><CalendarDays size={18} /> Manage Events</a>
        </nav>
      </div>

      <div className="admin-main">
        {view === 'dashboard' && (
          <>
            <h2 style={{ marginBottom: 24 }}>Dashboard</h2>
            <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div className="stat-card"><h3>{stats.total || 0}</h3><p>Total Events</p></div>
              <div className="stat-card"><h3 style={{ color: 'var(--green)' }}>{stats.upcoming || 0}</h3><p>Upcoming</p></div>
              <div className="stat-card"><h3 style={{ color: 'var(--amber)' }}>{stats.ongoing || 0}</h3><p>Ongoing</p></div>
              <div className="stat-card"><h3 style={{ color: '#2563EB' }}>{stats.completed || 0}</h3><p>Completed</p></div>
            </div>
            <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: 24, marginTop: 24 }}>
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <h3>Recent Events</h3>
                <button className="btn btn-primary btn-sm" onClick={() => { setView('events'); openCreate(); }}><Plus size={16} /> Add Event</button>
              </div>
              <table className="data-table">
                <thead><tr><th>Event</th><th>Date</th><th>Type</th><th>Status</th><th>Registrations</th></tr></thead>
                <tbody>{events.slice(0, 5).map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 600 }}>{e.title}</td>
                    <td>{e.eventDate}</td>
                    <td><span className={'badge badge-' + (e.eventType || '').toLowerCase().replace(/\s+/g, '-')}>{e.eventType}</span></td>
                    <td><span className={`badge badge-${(e.status || '').toLowerCase()}`}>{e.status}</span></td>
                    <td>{e.currentRegistrations}/{e.maxCapacity}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )}

        {view === 'events' && (
          <>
            <div className="flex-between" style={{ marginBottom: 24 }}>
              <h2>Manage Events</h2>
              <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Create Event</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Event</th><th>Date</th><th>Dept</th><th>Type</th><th>Status</th><th>Regs</th><th>Actions</th></tr></thead>
              <tbody>{events.map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</td>
                  <td>{e.eventDate}</td>
                  <td style={{ fontSize: 13 }}>{e.department}</td>
                  <td><span className={'badge badge-' + (e.eventType || '').toLowerCase().replace(/\s+/g, '-')}>{e.eventType}</span></td>
                  <td><span className={`badge badge-${(e.status || '').toLowerCase()}`}>{e.status}</span></td>
                  <td>{e.currentRegistrations}/{e.maxCapacity}</td>
                  <td><div className="table-actions">
                    <button className="icon-btn" title="Edit" onClick={() => openEdit(e)}><Edit size={16} /></button>
                    <button className="icon-btn" title="Registrations" onClick={() => viewRegs(e)}><Users size={16} /></button>
                    <button className="icon-btn" title="Export" onClick={() => exportExcel(e)}><Download size={16} /></button>
                    <button className="icon-btn danger" title="Delete" onClick={() => handleDelete(e.id)}><Trash2 size={16} /></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </>
        )}
      </div>

      {modal === 'form' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="flex-between"><h3>{editId ? 'Edit Event' : 'Create Event'}</h3><button className="icon-btn" onClick={() => setModal(null)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Title *</label><input className="form-control" name="title" value={form.title} onChange={handleChange} required /></div>
              <div className="form-group"><label>Description *</label><textarea className="form-control" name="description" value={form.description} onChange={handleChange} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Event Date *</label><input type="date" className="form-control" name="eventDate" value={form.eventDate} onChange={handleChange} required /></div>
                <div className="form-group"><label>Registration Deadline</label><input type="date" className="form-control" name="registrationDeadline" value={form.registrationDeadline || ''} onChange={handleChange} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Start Time</label><input type="time" className="form-control" name="startTime" value={form.startTime} onChange={handleChange} /></div>
                <div className="form-group"><label>End Time</label><input type="time" className="form-control" name="endTime" value={form.endTime} onChange={handleChange} /></div>
              </div>
              <div className="form-group"><label>Venue *</label><input className="form-control" name="venue" value={form.venue} onChange={handleChange} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Department *</label><select className="form-control" name="department" value={form.department} onChange={handleChange} required><option value="">Select</option>{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                <div className="form-group"><label>Event Type *</label><select className="form-control" name="eventType" value={form.eventType} onChange={handleChange} required><option value="">Select</option>{eventTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Max Capacity</label><input type="number" className="form-control" name="maxCapacity" value={form.maxCapacity} onChange={handleChange} /></div>
                <div className="form-group"><label>Status</label><select className="form-control" name="status" value={form.status} onChange={handleChange}><option value="UPCOMING">Upcoming</option><option value="ONGOING">Ongoing</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" name="isFree" checked={form.isFree} onChange={handleChange} /> Free Event</label></div>
                {!form.isFree && <div className="form-group"><label>Fee (₹)</label><input type="number" className="form-control" name="fee" value={form.fee} onChange={handleChange} /></div>}
              </div>
              <div className="form-group"><label>Speakers (comma separated)</label><input className="form-control" name="speakers" value={form.speakers || ''} onChange={handleChange} placeholder="Dr. A, Prof. B" /></div>
              <div className="form-group"><label>Designations (comma separated)</label><input className="form-control" name="speakerDesignations" value={form.speakerDesignations || ''} onChange={handleChange} placeholder="HOD CSE, Professor" /></div>
              <div className="modal-footer"><button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editId ? 'Update Event' : 'Create Event'}</button></div>
            </form>
          </div>
        </div>
      )}

      {regsModal && (
        <div className="modal-overlay" onClick={() => setRegsModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="flex-between"><h3>Registrations: {regsModal.title}</h3><button className="icon-btn" onClick={() => setRegsModal(null)}><X size={20} /></button></div>
            <p style={{ color: 'var(--slate)', marginBottom: 16 }}>{regs.length} registrations</p>
            {regs.length === 0 ? <p>No registrations yet.</p> : (
              <table className="data-table"><thead><tr><th>#</th><th>Name</th><th>Reg No</th><th>Dept</th><th>Status</th></tr></thead><tbody>
                {regs.map((r, i) => <tr key={r.id}><td>{i + 1}</td><td>{r.user?.fullName}</td><td>{r.user?.studentId || 'N/A'}</td><td>{r.user?.department || 'N/A'}</td><td><span className={`badge badge-${r.status?.toLowerCase()}`}>{r.status}</span></td></tr>)}
              </tbody></table>
            )}
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => exportExcel(regsModal)}><Download size={14} /> Export Excel</button>
              <button className="btn btn-ghost" onClick={() => setRegsModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
