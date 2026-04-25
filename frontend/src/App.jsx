import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import MyEvents from './pages/MyEvents';
import Admin from './pages/Admin';
import './index.css';

function Layout({ children, hideFooter }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)', paddingTop: 64 }}>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: 8, fontFamily: 'Inter, sans-serif' } }} />
        <Routes>
          <Route path="/" element={<Layout><Landing /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />
          <Route path="/my-events" element={<Layout><MyEvents /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Layout hideFooter><Admin /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
