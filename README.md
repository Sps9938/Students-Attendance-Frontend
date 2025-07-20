# Table of Contents
1. [Student Attendance Management System](#-student-attendance-management-system)

2. [Features](#-features)

3. [Tech Stack](#-tech-stack)

4. [Project Structure](#-project-structure)

5. [Getting Started](#-getting-started)

6. [Environment Variables](#-environment-variables)

7. [Running the App](#-running-the-app)

8. [Documentation](#-documentation)

9. [Mobile App (Future Plan)](#-mobile-app-future-plan)

    ---

# 📘 Student Attendance Management System

A full-featured web application to manage student attendance with internet-based , flexible attendance modes, secure OTP-based authentication, and rich analytics — built using the **MERN stack** and modern frontend tooling.

---

## Features

- 👥 **User Authentication**
  - OTP-based Login & Signup
  - Password Reset & Change

- **Class Management**
  - Create/manage classes by academic batch
  - Assign subjects/courses per class

- **Student Management**
  - Add students manually or via Excel upload
  - Real-time duplicate detection (name, roll no.)

- **Attendance Marking**
  - Intuitive grid UI (mouse or keyboard)
  - Present/Absent mode selection

- **Reports & Analytics**
  - Attendance stats & low-attendance warnings
  - Export reports as PDF and Excel
  - Cloudinary-based PDF uploads

- **User Profile**
  - View & update personal details
  - Change or reset password

- **Mobile App (Planned)**
  - React Native version
  - Offline-first support with background sync

---

## Tech Stack

### Frontend (React + Vite + Tailwind CSS)
- React (with Hooks & Functional Components)
- Redux Toolkit (state management)
- React Router DOM (routing)
- Tailwind CSS (modern styling)
- Vite (lightning-fast dev server)
- html2pdf.js, xlsx, jsPDF (report exports)
- Cloudinary (file upload integration)

### Backend (Node.js + Express + MongoDB)
- Express.js (RESTful APIs)
- MongoDB + Mongoose (NoSQL database)
- JWT + bcrypt (authentication)
- Nodemailer (OTP email verification)
- Multer (file handling)
- Middleware: CORS, Helmet, Morgan, dotenv

---

## Project Structure

### Frontend (`/Frontend`)
```
📁 src
├── app/            # Redux store
├── assets/         # Images & styles
├── components/     # Shared UI components (modals, layout, buttons)
├── features/
│   ├── auth/       # Login, signup, OTP, password management
│   ├── Header/     # App bar and navigation
│   ├── Home/       # Dashboard / landing
│   ├── classes/    # Class management
│   ├── students/   # Student CRUD and Excel import
│   ├── user/       # Profile update & security
│   ├── attendance/ # Marking attendance, reports
├── pages/          # Top-level pages
└── main.jsx        # Entry point
```

### Backend (`/Backend`)
```
📁 Backend
├── controllers/    # Request handling logic
├── middlewares/    # Auth, error handling, multer, etc.
├── models/         # Mongoose schemas (User, Class, Student, Attendance)
├── routes/         # API route definitions
├── utils/          # OTP email, Cloudinary, PDF helpers
├── config/         # DB & cloud configurations
└── server.js       # App entry point
```

---

## Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/sps9938/Students-Attendance-Frontend
cd Students-Attendance-Frontend
```

### 2️⃣ Initial Setup

#### Backend
```bash
cd Backend
npm install
```

#### Frontend
```bash
cd ../Frontend
npm install
npm install axios react-router-dom redux react-redux @reduxjs/toolkit tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3️⃣ Tailwind Setup
In `tailwind.config.js`:
```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
theme: { extend: {} },
plugins: [],
```

In `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Environment Variables

### Backend (`/Backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`/Frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## Running the App

> Make sure MongoDB and environment variables are correctly configured.

### Start Backend
```bash
cd Backend
npm run dev
```

### Start Frontend
```bash
cd ../Frontend
npm run dev
```

> App will be available at `http://localhost:5173` (Vite)

---

## Documentation

- [React Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/en/main)

---

## Mobile App (Future Plan)

- Build using React Native
- Offline attendance marking
- Sync attendance data when reconnected
- Push notifications for status updates

---

## Author

Developed with ❤️ by **Satya**  
🔗 GitHub: [https://github.com/Sps9938](https://github.com/Sps9938)

