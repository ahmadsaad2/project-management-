Project-management System
This is a **Student & Admin Dashboard Web Application**, built using modern web technologies to help manage tasks, projects, and student progress in an educational environment.

The platform allows two types of users — **Admins** and **Students** — to interact with a centralized system where:
- ✅ **Admins** can create and assign projects and tasks
- ✅ **Students** can view their assigned tasks, track deadlines, and update task statuses
- ✅ All data is stored securely in a **MySQL database** (via XAMPP)
- ✅ Authentication is handled via React Context API and localStorage/sessionStorage

The frontend is built with **React + TypeScript + Tailwind CSS**, ensuring a clean and responsive UI. The backend uses **Node.js with Express** to handle user authentication, data retrieval, and updates from the frontend.

---

### 🔧 Key Features

#### For Students:
- View assigned tasks and projects
- Track task status: `pending`, `in-progress`, `completed`
- See upcoming deadlines within the next 7 days
- Interactive dashboard with charts showing progress and distribution

#### For Admins:
- Manage all users, tasks, and projects
- Add, edit, or delete projects/tasks
- Monitor overall progress across students
- Visual statistics with chart components

#### General:
- ✅ Login and registration flow
- ✅ Role-based redirection
- ✅ Real-time clock display
- ✅ Responsive layout for mobile and desktop

---

### 🧰 Technologies Used

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Tailwind CSS, react-router-dom |
| Backend | Node.js, Express |
| Database | MySQL (XAMPP) |
| State Management | React Context API |
| Charts | Custom Chart Components (`DashboardChart`) |

---

### 📁 Folder Structure

```
project-management-platform/
│
├── for backend
│   ├── /server       # Express server with API routes
│   └── package.json       # Server dependencies
│
├──  for frontend
│   ├── src/
│   │   ├── pages/         # Login, Register, Dashboards
│   │   ├── contexts/      # AuthContext, UserContext, TaskContext, ProjectContext
│   │   ├── components/    # Reusable UI components (StatCard, DashboardChart)
│   │   └── App.tsx        # Main routing and app structure
│   └── package.json       # Client dependencies
│
└── README.md              # Project overview
```

---

### 🚀 Future Improvements

- [ ] Integrate real-time updates using WebSocket
- [ ] Add form validation and error handling

---
