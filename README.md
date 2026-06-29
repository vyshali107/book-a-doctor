# 🏥 Book a Doctor — MERN Stack Healthcare Booking Platform

A full-stack healthcare appointment booking application built with **MongoDB, Express.js, React.js, and Node.js**.

---

## 🚀 Features

- **Patient**: Register, browse doctors, book appointments, upload medical documents, view appointment history
- **Doctor**: Create/update profile, manage appointment requests (confirm/cancel/complete), view patient info
- **Admin**: Approve/reject doctors, manage users, view all appointments and platform stats
- **Auth**: JWT-based authentication with role-based access control (patient / doctor / admin)
- **Document Upload**: Secure file uploads (PDF, images, docs) using Multer

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js, React Router v6, Axios  |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT + bcryptjs                    |
| Styling    | Pure CSS with CSS variables       |
| Uploads    | Multer                            |
| Toasts     | React Toastify                    |

---

## 📁 Project Structure

```
book-a-doctor/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── uploads/        # Uploaded files (auto-created)
│   ├── .env            # Environment variables
│   └── server.js       # Entry point
└── frontend/
    ├── public/
    └── src/
        ├── components/ # Reusable components (Navbar)
        ├── context/    # Auth context
        ├── pages/      # All page components
        └── utils/      # Axios instance
```

---

## ⚙️ Setup & Run

### 1. Prerequisites
- Node.js v16+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `.env` with your MongoDB URI and JWT secret:
```
MONGO_URI=mongodb://localhost:27017/book-a-doctor
JWT_SECRET=your_super_secret_key
```

Start the backend:
```bash
npm run dev      # development (with nodemon)
npm start        # production
```

Backend runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000** and proxies API calls to port 5000.

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | /api/auth/register    | Register user       |
| POST   | /api/auth/login       | Login               |
| GET    | /api/auth/profile     | Get own profile     |
| PUT    | /api/auth/profile     | Update profile      |

### Doctors
| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| GET    | /api/doctors          | List approved doctors   |
| GET    | /api/doctors/:id      | Get doctor details      |
| POST   | /api/doctors          | Create doctor profile   |
| PUT    | /api/doctors/:id      | Update doctor profile   |
| GET    | /api/doctors/me       | Get own doctor profile  |

### Appointments
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | /api/appointments         | Book appointment          |
| GET    | /api/appointments/my      | Patient's appointments    |
| GET    | /api/appointments/doctor  | Doctor's appointments     |
| PUT    | /api/appointments/:id     | Update status             |
| DELETE | /api/appointments/:id     | Cancel appointment        |

### Admin
| Method | Endpoint                        | Description            |
|--------|---------------------------------|------------------------|
| GET    | /api/admin/stats                | Platform statistics    |
| GET    | /api/admin/users                | All users              |
| DELETE | /api/admin/users/:id            | Delete user            |
| GET    | /api/admin/doctors              | All doctors            |
| PUT    | /api/admin/doctors/:id/approve  | Approve/reject doctor  |

### Documents
| Method | Endpoint                     | Description          |
|--------|------------------------------|----------------------|
| POST   | /api/documents/:appointmentId | Upload document     |
| GET    | /api/documents/:appointmentId | Get documents       |

---

## 👤 Default Admin

To create an admin, register normally then update the `role` field in MongoDB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## 📸 Pages

- `/` — Landing page with hero, specializations, features
- `/doctors` — Browse and search doctors
- `/doctors/:id` — Doctor profile and booking CTA
- `/register` — Register as patient or doctor
- `/login` — Login
- `/patient/dashboard` — Patient appointment management + document upload
- `/doctor/dashboard` — Doctor schedule management + profile setup
- `/admin/dashboard` — Admin control panel
- `/book/:doctorId` — Book appointment form

---

## 📝 Skills Required (as per SkillWallet)

- CSS3
- Node.js
- Express.js
- React.js
- MongoDB
- JavaScript

---

## 🏗️ Future Enhancements

- [ ] Email notifications (nodemailer config ready)
- [ ] Payment integration (Razorpay/Stripe)
- [ ] Video consultation
- [ ] Doctor ratings & reviews
- [ ] Prescription management
- [ ] SMS reminders
