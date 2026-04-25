<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

# 🎓 Smart Campus Event Management System

> **Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology**

A full-stack web application for managing campus events — from creation to registration, feedback, and analytics. Built with **Spring Boot** on the backend and **React + Vite** on the frontend, connected to a **MySQL** database with **JWT-based authentication**.

---

## ✨ Features

### 👨‍🎓 Student Portal
- 🔍 Browse & filter events by department, type, and status
- 📝 One-click event registration with capacity tracking
- 📅 Personal dashboard to manage registered events
- ⭐ Star-rating feedback system for completed events
- 🔐 Secure JWT-based login and registration

### 🛡️ Admin Panel
- 📊 Dashboard with live statistics (total events, registrations, users)
- ➕ Full CRUD — create, edit, and delete events
- 👥 View registered students per event
- 📥 Export registration lists to Excel (`.xlsx`)
- 🌱 Auto-seeded sample data on first startup

---

## 🏗️ Architecture

```
┌──────────────────┐     HTTP/REST (JSON)     ┌───────────────────┐     JPA/Hibernate     ┌────────┐
│   React + Vite   │ ──────────────────────→  │  Spring Boot API  │ ──────────────────→   │  MySQL │
│   Port: 5173     │   /api/* proxy via Vite  │    Port: 8080     │   veltech_events DB   │        │
└──────────────────┘                          └───────────────────┘                       └────────┘
```

The Vite dev server proxies all `/api/*` requests to the Spring Boot backend, eliminating CORS issues during development.

---

## 📁 Project Structure

```
FSD_Phase_2/
│
├── backend/                              # Spring Boot REST API
│   ├── pom.xml                           # Maven dependencies
│   └── src/main/
│       ├── resources/
│       │   └── application.properties    # DB, JWT, server config
│       └── java/com/veltech/events/
│           ├── CampusEventsApplication   # Entry point
│           ├── config/                   # Security, JWT filter, Data seeder
│           ├── controller/               # 5 REST controllers
│           ├── dto/                      # Request/Response DTOs
│           ├── entity/                   # 4 JPA entities
│           ├── repository/               # Spring Data JPA repos
│           ├── service/                  # Business logic layer
│           └── exception/                # Global error handler
│
├── frontend/                             # React SPA
│   ├── vite.config.js                    # Dev server + API proxy
│   ├── package.json                      # NPM dependencies
│   └── src/
│       ├── main.jsx                      # React entry point
│       ├── App.jsx                       # Router + Layout
│       ├── index.css                     # Global styles
│       ├── context/AuthContext.jsx        # Auth state (Context API)
│       ├── services/api.js               # Axios HTTP client + interceptors
│       ├── components/                   # Navbar, Footer
│       └── pages/                        # Landing, Events, Login, Admin, etc.
│
├── explain.md                            # Detailed technical walkthrough
└── README.md                             # ← You are here
```

---

## 🗄️ Database Schema

```
┌──────────┐       ┌────────────────┐       ┌──────────┐
│   User   │──1:N──│  Registration  │──N:1──│  Event   │
│  (users) │       │(registrations) │       │ (events) │
└────┬─────┘       └────────────────┘       └────┬─────┘
     │             ┌────────────────┐             │
     └─────1:N─────│    Feedback    │─────N:1─────┘
                   │  (feedbacks)   │
                   └────────────────┘
```

| Entity | Key Fields |
|--------|------------|
| **User** | id, fullName, email, password (BCrypt), studentId, phone, department, yearOfStudy, role (`STUDENT` / `ADMIN`) |
| **Event** | id, title, description, eventDate, startTime, endTime, venue, department, eventType, maxCapacity, currentRegistrations, status, isFree, fee, speakers |
| **Registration** | id, user (FK), event (FK), status (`CONFIRMED` / `CANCELLED` / `ATTENDED`) |
| **Feedback** | id, user (FK), event (FK), rating (1–5), comment |

> **Unique constraints** on `(user_id, event_id)` prevent duplicate registrations and feedback at the database level.

---

## 🔐 Authentication Flow

```
Register/Login → Backend validates → JWT token generated (24h expiry)
     ↓
Token stored in localStorage
     ↓
Every API call → Axios interceptor auto-attaches "Authorization: Bearer <token>"
     ↓
JwtAuthFilter validates token → Sets Spring Security context
```

| Endpoint Pattern | Access Level |
|-----------------|--------------|
| `/api/auth/**` | 🌐 Public |
| `GET /api/events/**` | 🌐 Public |
| `/api/registrations/**` | 🔒 Authenticated |
| `/api/feedbacks/**` | 🔒 Authenticated |
| `/api/admin/**` | 🛡️ Admin Only |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Java** | 17+ | Backend runtime |
| **Maven** | 3.9+ | Backend build tool |
| **Node.js** | 18+ | Frontend runtime |
| **npm** | 9+ | Frontend package manager |
| **MySQL** | 8.0+ | Database |

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/smalok/Full_Stack_Development.git
cd Full_Stack_Development
```

### 2️⃣ Set Up MySQL

Ensure MySQL is running on `localhost:3306`. The database will be auto-created.

```sql
-- Default config (see backend/src/main/resources/application.properties):
-- Username: root
-- Password: root@2128
-- Database: veltech_events (auto-created)
```

> ⚠️ Update `application.properties` if your MySQL credentials differ.

### 3️⃣ Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The API will start on **http://localhost:8080**. On first run, the `DataSeeder` auto-creates:
- 🔑 Admin account: `admin@veltech.edu.in` / `admin123`
- 📅 8 sample events (Hackathon, AI Workshop, Cultural Fest, etc.)

### 4️⃣ Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🖥️ Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero section, live stats, upcoming events showcase |
| `/events` | Events | Browse all events with filters (department, type, status) + search |
| `/events/:id` | Event Detail | Full event info, speakers, registration button |
| `/login` | Login / Signup | Tab-based auth with Student/Admin toggle |
| `/my-events` | My Events | Personal dashboard — upcoming, completed, cancel & feedback |
| `/admin` | Admin Panel | Dashboard stats, CRUD events, view registrations, Excel export |

---

## 🔧 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new student account |
| `POST` | `/api/auth/login` | Login and receive JWT token |

### Events (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/events` | List all events (with optional filters) |
| `GET` | `/api/events/{id}` | Get event details |
| `GET` | `/api/events/upcoming` | Get upcoming events |
| `GET` | `/api/events/stats` | Get event statistics |

### Registrations (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/registrations/{eventId}` | Register for an event |
| `GET` | `/api/registrations/my` | Get current user's registrations |
| `PUT` | `/api/registrations/{id}/cancel` | Cancel a registration |

### Feedback (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/feedbacks` | Submit feedback for an event |
| `GET` | `/api/feedbacks/event/{eventId}` | Get feedback for an event |

### Admin (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/events` | Create a new event |
| `PUT` | `/api/admin/events/{id}` | Update an event |
| `DELETE` | `/api/admin/events/{id}` | Delete an event |
| `GET` | `/api/admin/events/{id}/registrations` | View registrations for an event |
| `GET` | `/api/admin/events/{id}/export` | Export registrations to Excel |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Spring Boot 3.4.5 | REST API framework |
| Spring Security | Authentication & authorization |
| Spring Data JPA | ORM & database access |
| JJWT 0.12.6 | JWT token generation & validation |
| BCrypt | Password hashing |
| Apache POI 5.3 | Excel file generation |
| Lombok | Boilerplate reduction |
| MySQL Connector | Database driver |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI component library |
| Vite 8 | Build tool & dev server |
| React Router DOM 7 | Client-side routing |
| Axios | HTTP client with interceptors |
| React Hot Toast | Toast notifications |
| Lucide React | Icon library |

---

## 🎯 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **JWT over Sessions** | Stateless auth — no server-side session storage needed |
| **BCrypt Hashing** | Industry standard; passwords unrecoverable even if DB is compromised |
| **Unique Constraints** | DB-level prevention of duplicate registrations and feedback |
| **Vite Proxy** | Same-origin requests in dev — no CORS configuration needed |
| **`ddl-auto=update`** | Hibernate auto-creates/updates MySQL tables from JPA entities |
| **CommandLineRunner Seeder** | Auto-populates admin + sample events on first startup |
| **Axios Interceptors** | Automatically attaches JWT to every outgoing API request |
| **React Context API** | Global auth state without prop-drilling |
| **Apache POI** | Server-side Excel generation for offline registration data |
| **ApiResponse Wrapper** | Consistent `{ success, message, data }` JSON format |

---

## 📊 Project Stats

| Metric | Count |
|--------|-------|
| Source Files | ~35 |
| Database Tables | 4 |
| REST Controllers | 5 |
| Service Classes | 4 |
| Frontend Pages | 6 |
| API Endpoints | ~15 |

---

## 👤 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@veltech.edu.in` | `admin123` |
| **Student** | Register via `/login` | — |

---

## 📄 License

This project was developed as part of the **Full Stack Development** coursework at **Vel Tech University**.

---

<p align="center">
  Made with ❤️ by <strong>Soumitra Malok</strong> — Vel Tech University
</p>