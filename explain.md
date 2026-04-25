# 🎓 VelTech Smart Campus Event Management System — Complete Project Explanation

> **Project Name:** Smart Campus Event Management System  
> **University:** Vel Tech Rangarajan Dr.Sagunthala R&D Institute of Science and Technology  
> **Tech Stack:** Spring Boot 3.4.5 (Java 17) + React 19 (Vite 8) + MySQL  

---

## 📁 Project Structure Overview

```
Soumitra/
├── backend/                         ← Spring Boot REST API
│   ├── pom.xml                      ← Maven dependencies
│   └── src/main/
│       ├── resources/
│       │   └── application.properties   ← DB, JWT, server config
│       └── java/com/veltech/events/
│           ├── CampusEventsApplication.java  ← Entry point
│           ├── config/              ← Security, JWT, Data Seeder
│           ├── controller/          ← REST API endpoints (5 files)
│           ├── dto/                 ← Request/Response objects (5 files)
│           ├── entity/              ← JPA Database models (4 files)
│           ├── repository/          ← Spring Data JPA queries (4 files)
│           ├── service/             ← Business logic (4 files)
│           └── exception/           ← Error handling (2 files)
└── frontend/                        ← React SPA
    ├── vite.config.js               ← Dev server + API proxy
    ├── package.json                 ← NPM dependencies
    └── src/
        ├── main.jsx                 ← React entry point
        ├── App.jsx                  ← Router + Layout
        ├── index.css                ← Global styles
        ├── context/AuthContext.jsx   ← Auth state management
        ├── services/api.js          ← Axios HTTP client
        ├── components/              ← Navbar.jsx, Footer.jsx
        └── pages/                   ← Landing, Events, Login, Admin, etc.
```

---

## 🏗️ Architecture — How Frontend & Backend Connect

```
┌──────────────┐    HTTP (REST)    ┌──────────────────┐    JPA/Hibernate    ┌───────┐
│  React (Vite)│ ──────────────→   │  Spring Boot API │ ────────────────→   │ MySQL │
│  Port: 5173  │  /api/* proxied   │    Port: 8080    │  veltech_events DB  │       │
└──────────────┘  via vite.config  └──────────────────┘                     └───────┘
```

**Why proxy?** React dev server runs on port `5173`, backend on `8080`. Vite proxy forwards `/api/*` to `localhost:8080`, avoiding CORS issues.

```js
// vite.config.js — KEY SNIPPET
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false,
  },
},
```

---

## 🔐 LAYER 1: Authentication System (JWT)

### How JWT Auth Works (Step-by-Step)

```
Student clicks "Register" on Login page
        │
        ▼
Frontend (Login.jsx) → POST /api/auth/register
        │
        ▼
AuthController.java → AuthService.register()
  1. Check if email exists (UserRepository.existsByEmail)
  2. Hash password with BCryptPasswordEncoder
  3. Save User entity to MySQL
  4. Generate JWT token via JwtUtil.generateToken(email, role)
  5. Return AuthResponse (token + user info)
        │
        ▼
Frontend stores token in localStorage → user is logged in
        │
        ▼
Every future API call → Axios interceptor adds "Authorization: Bearer <token>"
        │
        ▼
JwtAuthFilter.java intercepts request → validates token → sets SecurityContext
```

### Key Files & Code

**`AuthService.java`** — Registration logic:
```java
// Hash password, save user, generate token
User user = User.builder()
    .fullName(request.getFullName())
    .email(request.getEmail())
    .password(passwordEncoder.encode(request.getPassword()))  // BCrypt
    .role(Role.STUDENT)
    .build();
user = userRepository.save(user);
String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
```

**`AuthService.java`** — Login logic:
```java
User user = userRepository.findByEmail(request.getEmail())
    .orElseThrow(() -> new IllegalArgumentException("No account found..."));
if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
    throw new IllegalArgumentException("Incorrect password");
}
String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
```

**`JwtUtil.java`** — Token generation (24hr expiry):
```java
public String generateToken(String email, String role) {
    return Jwts.builder()
        .subject(email)
        .claim("role", role)
        .expiration(new Date(System.currentTimeMillis() + 86400000))
        .signWith(getSigningKey())
        .compact();
}
```

**`JwtAuthFilter.java`** — Intercepts EVERY HTTP request:
```java
String token = getTokenFromRequest(request);  // Extract from "Bearer xxx"
if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
    String email = jwtUtil.getEmailFromToken(token);
    var user = userRepository.findByEmail(email);
    // Set Spring Security authentication context
    SecurityContextHolder.getContext().setAuthentication(authentication);
}
```

**`SecurityConfig.java`** — URL access rules:
```java
.requestMatchers("/api/auth/**").permitAll()             // Public
.requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()  // Public
.requestMatchers("/api/admin/**").hasRole("ADMIN")       // Admin only
.requestMatchers("/api/registrations/**").authenticated() // Logged-in
.requestMatchers("/api/feedbacks/**").authenticated()     // Logged-in
```

**Frontend `AuthContext.jsx`** — Stores auth state:
```jsx
const login = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
  setUser(userData);
};
const isAdmin = () => user?.role === 'ADMIN';
```

**Frontend `api.js`** — Auto-attaches JWT to requests:
```js
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});
```

---

## 📦 LAYER 2: Database Design (4 Entities)

### ER Diagram

```
┌─────────┐       ┌───────────────┐       ┌─────────┐
│  User   │──1:N──│ Registration  │──N:1──│  Event  │
│ (users) │       │(registrations)│       │ (events)│
└────┬────┘       └───────────────┘       └────┬────┘
     │            ┌───────────────┐             │
     └───1:N──────│   Feedback    │──────N:1────┘
                  │  (feedbacks)  │
                  └───────────────┘
```

**`User.java`** — id, fullName, email, password, studentId, phone, department, yearOfStudy, role (STUDENT/ADMIN)

**`Event.java`** — id, title, description, eventDate, startTime, endTime, venue, department, eventType, maxCapacity, currentRegistrations, status (UPCOMING/ONGOING/COMPLETED/CANCELLED), isFree, fee, speakers, speakerDesignations

**`Registration.java`** — id, user (FK), event (FK), status (CONFIRMED/CANCELLED/ATTENDED)

**`Feedback.java`** — id, user (FK), event (FK), rating (1-5), comment

**Key constraints** (prevents duplicates at DB level):
```java
// Registration.java
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = {"user_id", "event_id"}) })

// Feedback.java  
@Table(uniqueConstraints = { @UniqueConstraint(columnNames = {"user_id", "event_id"}) })
```

---

## 🌱 LAYER 3: Data Seeder (`DataSeeder.java`)

Implements `CommandLineRunner` — runs automatically when Spring Boot starts:

```java
// Creates admin if not exists
if (!userRepository.existsByEmail("admin@veltech.edu.in")) {
    User admin = User.builder()
        .email("admin@veltech.edu.in")
        .password(passwordEncoder.encode("admin123"))
        .role(Role.ADMIN).build();
}
// Creates 8 sample events if DB is empty
if (eventRepository.count() == 0) { /* seeds 8 events */ }
```

**Default Admin:** `admin@veltech.edu.in` / `admin123`
**Sample Events:** Hackathon, AI Workshop, Guest Lecture, Cultural Fest, AWS Workshop, Cybersecurity Seminar, Sports Day, Tech Fest

---

## 🖥️ LAYER 4: Frontend Pages

### `Landing.jsx` (Route: `/`)
- Calls `getUpcomingEvents()` + `getEventStats()` on mount
- Hero section with stats, top 6 upcoming event cards, "How it works" steps

### `Login.jsx` (Route: `/login`)
- Tab-based: Login vs Signup. Login has Student/Admin toggle
- Client-side validation → API call → stores user in AuthContext → redirects

### `Events.jsx` (Route: `/events`)
- Fetches events with 3 filter dropdowns (department, type, status) + search bar
- Event cards with type badges, progress bars, click to view detail

### `EventDetail.jsx` (Route: `/events/:id`)
- Shows event info + speakers + sidebar with date/time/venue/capacity
- Register button: checks login, checks if already registered, handles errors

### `MyEvents.jsx` (Route: `/my-events`)
- Tabs: All / Upcoming / Completed with stats cards
- Cancel registration for upcoming, Give Feedback for completed (modal with star rating)

### `Admin.jsx` (Route: `/admin`)
- Protected (admin only). Sidebar: Dashboard / Manage Events
- Dashboard: stats cards + recent events table
- Manage Events: full CRUD table + Edit modal, View Registrations modal, Excel export, Delete

---

## 🔄 LAYER 5: Complete User Flows

### Flow 1: Student Registers for Event

```
1. /events → clicks event card → /events/3
2. Clicks "Register for this Event"
3. Not logged in? → redirect to /login → login → back
4. POST /api/registrations/3
5. RegistrationService.registerForEvent():
   a. existsByUserIdAndEventId? → "Already registered" error
   b. currentRegistrations >= maxCapacity? → "Fully booked" error
   c. status not UPCOMING/ONGOING? → "Not open" error
   d. Save Registration (CONFIRMED) + increment event count
6. UI shows "You are registered!" badge
```

### Flow 2: Feedback Submission

```
1. /my-events → completed event → "Give Feedback"
2. Modal: select stars (1-5) + comment → Submit
3. POST /api/feedbacks
4. FeedbackService checks:
   a. Was user registered? (must be registered to give feedback)
   b. Already gave feedback? (one per event)
   c. Save Feedback
5. Event detail page shows average rating + feedback list
```

### Flow 3: Admin CRUD

```
1. Admin logs in → /admin
2. Create: modal form → POST /api/admin/events
3. Edit: pre-filled modal → PUT /api/admin/events/:id
4. Delete: confirm dialog → DELETE /api/admin/events/:id
5. View registrations: modal table → GET /api/admin/events/:id/registrations
```

### Flow 4: Excel Export

```
1. Admin clicks Download icon → GET /api/admin/events/:id/export
2. RegistrationService.exportRegistrationsToExcel():
   - Apache POI creates XSSFWorkbook
   - Header: S.No, Name, Reg Number, Email, Phone, Dept, Year, Status, Date
   - Returns byte[] as .xlsx file
3. Frontend creates Blob → triggers download
```

---

## 🛡️ LAYER 6: Error Handling (`GlobalExceptionHandler.java`)

| Exception | Status | When |
|-----------|--------|------|
| `MethodArgumentNotValidException` | 400 | Form validation fails (@NotBlank, @Email) |
| `ResourceNotFoundException` | 404 | Event/User not found by ID |
| `IllegalArgumentException` | 400 | Duplicate registration, wrong password |
| `AccessDeniedException` | 403 | Student tries admin endpoint |
| `Exception` (catch-all) | 500 | Unexpected error |

**Standard response format (`ApiResponse.java`):**
```json
{ "success": true/false, "message": "...", "data": { ... } }
```

---

## 📊 LAYER 7: Repository Queries

**`EventRepository.java`** — Multi-filter JPQL:
```java
@Query("SELECT e FROM Event e WHERE " +
       "(:department IS NULL OR e.department = :department) AND " +
       "(:eventType IS NULL OR e.eventType = :eventType) AND " +
       "(:status IS NULL OR e.status = :status) AND " +
       "(:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')))")
List<Event> findWithFilters(...);
```

**`FeedbackRepository.java`** — Average rating:
```java
@Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.event.id = :eventId")
Double getAverageRatingByEventId(Long eventId);
```

---

## ⚙️ LAYER 8: Configuration

**`application.properties`:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/veltech_events?createDatabaseIfNotExist=true
spring.jpa.hibernate.ddl-auto=update     # Auto-creates tables from entities
app.jwt.secret=VelTechCampusEventsSecretKey2026...
app.jwt.expiration=86400000              # 24 hours
```

**`pom.xml` key dependencies:** spring-boot-starter-web, data-jpa, security, validation, mysql-connector-j, jjwt (JWT), poi-ooxml (Excel), lombok

**`package.json` key deps:** react, react-router-dom, axios, react-hot-toast, lucide-react

---

## 🎯 Design Decisions — WHY

| Decision | Why |
|----------|-----|
| **JWT (not sessions)** | Stateless. Token carries all info. No server-side session storage. |
| **BCrypt hashing** | Industry standard. Passwords unrecoverable even if DB is stolen. |
| **UniqueConstraint on Registration/Feedback** | DB-level guarantee: no double registration or duplicate feedback. |
| **Vite proxy** | Frontend and backend appear on same origin. No CORS config needed in dev. |
| **ddl-auto=update** | Hibernate auto-creates/updates MySQL tables from Java entities. |
| **CommandLineRunner DataSeeder** | Auto-populates admin + sample events on first startup. |
| **Axios interceptors** | Auto-attaches JWT to every API call. |
| **React Context API** | Global auth state without prop-drilling. |
| **Apache POI** | Server-side Excel generation for offline registration data. |
| **ApiResponse wrapper** | Consistent JSON format makes frontend handling uniform. |

---

## 🚀 How to Run

1. **MySQL** running on `localhost:3306` (user: root, pass: root@2128)
2. **Backend:** `cd backend && mvn spring-boot:run` (port 8080)
3. **Frontend:** `cd frontend && npm install && npm run dev` (port 5173)
4. **Open:** `http://localhost:5173`
5. **Admin:** `admin@veltech.edu.in` / `admin123`

---

**Total: ~35 source files | 4 DB tables | 5 controllers | 4 services | 6 pages**
