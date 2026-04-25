import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Calendar size={24} />
          <span>VelTech Events</span>
        </Link>

        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/events" onClick={() => setMenuOpen(false)}>Events</Link>
          {user && !isAdmin() && (
            <Link to="/my-events" onClick={() => setMenuOpen(false)}>My Events</Link>
          )}
          {isAdmin() && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
          )}
        </div>

        <div className="nav-auth">
          {user ? (
            <div className="nav-user">
              <span className="nav-user-name">{user.fullName}</span>
              <span className="nav-user-badge">{user.role}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-btns">
              <Link to="/login" className="btn btn-secondary-nav">Login</Link>
              <Link to="/login?tab=signup" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
