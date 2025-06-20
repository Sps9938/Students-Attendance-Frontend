# 📘 Student Attendance Management System

A full-featured web application to manage student attendance with internet support, multiple attendance modes, secure OTP-based authentication, and rich analytics — built using the MERN stack and modern frontend tooling.



---

# Navigate to root
cd ../

# Create frontend project using Vite
npm create vite@latest Frontend -- --template react

cd Frontend

# Install required dependencies
npm install
npm install axios react-router-dom redux react-redux @reduxjs/toolkit tailwindcss postcss autoprefixer

# Tailwind setup
npx tailwindcss init -p

---

---

## 🚀 Features

- 👥 **User Authentication**
  - Signup/Login with OTP verification
  - Password change and recovery

- 🏫 **Class Management**
  - Create and manage classes based on year batch
  - Assign subjects/courses to each class

- 🧑‍🎓 **Student Management**
  - Add students manually or via Excel file upload
  - Detect and highlight duplicate entries

- ✅ **Attendance Marking**
  - Grid-based UI: Mark attendance by clicking or using the keyboard
  - Select mode: Present or Absent

- 📊 **Attendance Reports**
  - View overall attendance records
  - Export reports as **PDF** and **Excel**
  - Low attendance alerts

- 👤 **User Profile**
  - View/update user details
  - Change or reset password

- ☁️ **Cloud Integration**
  - Uploads PDF reports to **Cloudinary**

- 📱 **Future Goals**
  - Convert to a **React Native mobile app**
  - Publish on Google Play Store

---

## 🛠️ Tech Stack

### Frontend (Vite + React + Tailwind CSS)
- `React` (Functional components + Hooks)
- `Redux Toolkit` (State management)
- `React Router DOM` (Routing)
- `Tailwind CSS` (UI Styling)
- `Vite` (Blazing fast development)
- `html2pdf.js`, `xlsx`, `jspdf` (Export PDF/Excel)
- `Cloudinary` (PDF upload)


### Backend (Node.js + Express + MongoDB)
- `Express.js` (REST API)
- `MongoDB` + `Mongoose` (Database)
- `bcryptjs` + `jsonwebtoken` (Auth and security)
- `nodemailer` (OTP email sending)
- `multer` (File handling)
- `cloudinary` SDK (Upload PDFs)
- `cors`, `dotenv`, `helmet`, `morgan` (Middleware)

---

## 📁 Project Structure

### Frontend (`/client`)
```
📁 src
├── app/                # Redux store setup
├── assets/             # Images, styles
├── components/         # Common reusable components (modals, layout, buttons)
├── features/
│   ├── auth/           # Login, signup, OTP, change/forget password
│   ├── Header/         # Heading
│   ├── Home/           # Home Page
│   ├── classes/        # Class CRUD
│   ├── students/       # Add/import students
│   ├── user/           # update/delete/forget
│   ├── attendance/     # Attendance UI, reports
├── pages/              # Page-level components
└── main.jsx            # Entry point
```

### Backend (`/server`)
```
📁 server
├── controllers/        # Route logic
├── middlewares/        # Auth, multer, error handling
├── models/             # Mongoose schemas (User, Class, Student, Attendance)
├── routes/             # API endpoints
├── utils/              # Cloudinary, PDF helpers, OTP email
├── config/             # DB & cloud configs
└── server.js           # Entry point
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/sps9938/Students-Attendance-Frontend
cd Students-Attendance-Frontend
```

### 2. Install Dependencies

#### Backend
```bash
cd Backend
npm install
```

#### Frontend
```bash
cd Frontend
npm install
```

### 3. Environment Variables

#### Backend (`/server/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (`/client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 🧪 Run the App

> Requires internet connection for syncing data with backend & Frontend

### Backend
```bash
cd Backend
npm run dev
```

### Frontend
```bash
cd Frontend
npm run dev
```

---


### 📚 Documentation

- [React Docs](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/en/main)


## 📱 Mobile App (Future Plan)

- Offline-first data input
- Background sync when internet is available
- Native notifications for sync failure/success

---

## 📌 Credits

Developed by **Satya**  
🔗 [GitHub](https://github.com/Sps9938)

---


