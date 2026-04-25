import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

// Events (public)
export const getEvents = (params) => API.get('/events', { params });
export const getEventById = (id) => API.get(`/events/${id}`);
export const getUpcomingEvents = () => API.get('/events/upcoming');
export const getEventStats = () => API.get('/events/stats');

// Registrations (authenticated)
export const registerForEvent = (eventId) => API.post(`/registrations/${eventId}`);
export const getMyRegistrations = () => API.get('/registrations/my');
export const cancelRegistration = (regId) => API.put(`/registrations/${regId}/cancel`);
export const checkRegistration = (eventId) => API.get(`/registrations/check/${eventId}`);

// Feedback (authenticated)
export const submitFeedback = (data) => API.post('/feedbacks', data);
export const getEventFeedbacks = (eventId) => API.get(`/feedbacks/event/${eventId}`);
export const checkFeedback = (eventId) => API.get(`/feedbacks/check/${eventId}`);

// Admin
export const adminCreateEvent = (data) => API.post('/admin/events', data);
export const adminUpdateEvent = (id, data) => API.put(`/admin/events/${id}`, data);
export const adminDeleteEvent = (id) => API.delete(`/admin/events/${id}`);
export const adminGetRegistrations = (eventId) => API.get(`/admin/events/${eventId}/registrations`);
export const adminExportExcel = (eventId) => API.get(`/admin/events/${eventId}/export`, { responseType: 'blob' });
export const adminGetStats = () => API.get('/admin/stats');

export default API;
