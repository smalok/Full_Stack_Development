import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, CheckCircle, Star } from 'lucide-react';

const departments = ['CSE', 'AI & Data Science', 'AI & Machine Learning', 'ECE', 'EEE', 'Mechanical Engineering', 'Civil Engineering', 'Aeronautical Engineering', 'Biotechnology', 'Information Technology', 'MBA', 'Science & Humanities'];

export default function Login() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'login');
  const [loginType, setLoginType] = useState('student');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', studentId: '', phone: '', department: '', yearOfStudy: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => { if (user) navigate(user.role === 'ADMIN' ? '/admin' : '/'); }, [user]);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: '' }); };

  const validateLogin = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validateSignup = () => {
    const e = {};
    if (!form.fullName) e.fullName = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.department) e.department = 'Department is required';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      const userData = res.data?.data;
      login(userData);
      toast.success('Welcome back, ' + userData.fullName + '!');
      navigate(userData.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) { toast.error(err.response?.data?.message || 'Invalid credentials'); }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const res = await registerUser(data);
      const userData = res.data?.data;
      login(userData);
      toast.success('Account created! Welcome, ' + userData.fullName + '!');
      navigate('/');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Welcome to VelTech Events</h1>
        <p>Manage and track campus events at Vel Tech University</p>
        <div className="auth-features">
          <span><Calendar size={18} style={{ marginRight: 8 }} /> Browse 50+ events across departments</span>
          <span><CheckCircle size={18} style={{ marginRight: 8 }} /> One-click registration</span>
          <span><Star size={18} style={{ marginRight: 8 }} /> Rate and share your feedback</span>
        </div>
        <p style={{ marginTop: 'auto', opacity: 0.5, fontSize: 13 }}>Vel Tech Rangarajan Dr.Sagunthala R&D Institute of Science and Technology</p>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          {tab === 'login' ? (
            <>
              <div className="tabs" style={{ marginBottom: 24 }}>
                <button className={`tab ${loginType === 'student' ? 'active' : ''}`} onClick={() => setLoginType('student')}>Student</button>
                <button className={`tab ${loginType === 'admin' ? 'active' : ''}`} onClick={() => setLoginType('admin')}>Admin</button>
              </div>
              <h2>{loginType === 'admin' ? '🔐 Admin Login' : 'Sign In'}</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input className="form-control" name="email" type="email" placeholder={loginType === 'admin' ? 'admin@veltech.edu.in' : 'your.email@veltech.edu.in'} value={form.email} onChange={handleChange} />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input className="form-control" name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handleChange} />
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </div>
                <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>{loading ? 'Signing in...' : loginType === 'admin' ? 'Sign In as Admin' : 'Sign In'}</button>
              </form>
              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--slate)' }}>
                Don't have an account? <a style={{ color: 'var(--crimson)', fontWeight: 600, cursor: 'pointer' }} onClick={() => setTab('signup')}>Sign Up</a>
              </p>
            </>
          ) : (
            <>
              <h2>Create Account</h2>
              <form onSubmit={handleSignup}>
                <div className="form-group"><label>Full Name *</label><input className="form-control" name="fullName" placeholder="Enter your full name" value={form.fullName} onChange={handleChange} />{errors.fullName && <div className="form-error">{errors.fullName}</div>}</div>
                <div className="form-row">
                  <div className="form-group"><label>Register Number</label><input className="form-control" name="studentId" placeholder="e.g. 22BCE1234" value={form.studentId} onChange={handleChange} /></div>
                  <div className="form-group"><label>Phone</label><input className="form-control" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} /></div>
                </div>
                <div className="form-group"><label>Email *</label><input className="form-control" name="email" type="email" placeholder="your.email@veltech.edu.in" value={form.email} onChange={handleChange} />{errors.email && <div className="form-error">{errors.email}</div>}</div>
                <div className="form-row">
                  <div className="form-group"><label>Department *</label><select className="form-control" name="department" value={form.department} onChange={handleChange}><option value="">Select Department</option>{departments.map(d => <option key={d} value={d}>{d}</option>)}</select>{errors.department && <div className="form-error">{errors.department}</div>}</div>
                  <div className="form-group"><label>Year</label><select className="form-control" name="yearOfStudy" value={form.yearOfStudy} onChange={handleChange}><option value="">Select Year</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Password *</label><input className="form-control" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} />{errors.password && <div className="form-error">{errors.password}</div>}</div>
                  <div className="form-group"><label>Confirm Password *</label><input className="form-control" name="confirmPassword" type="password" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} />{errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}</div>
                </div>
                <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
              </form>
              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--slate)' }}>
                Already have an account? <a style={{ color: 'var(--crimson)', fontWeight: 600, cursor: 'pointer' }} onClick={() => setTab('login')}>Sign In</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
