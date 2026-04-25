import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3>VelTech Events</h3>
          <p>Smart Campus Event Management System for Vel Tech Rangarajan Dr.Sagunthala R&D Institute of Science and Technology.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/events">Browse Events</Link>
          <Link to="/login">Login</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>📧 events@veltech.edu.in</p>
          <p>📞 +91 94455 68802</p>
          <p>📍 Avadi, Chennai - 600062</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Vel Tech University. All rights reserved.</p>
      </div>
    </footer>
  );
}
