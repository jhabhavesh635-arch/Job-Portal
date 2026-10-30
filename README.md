<<<<<<< HEAD
# HireFlow - Recruitment Management System

HireFlow is a backend-based recruitment management system built using **Node.js, Express.js, and MongoDB**. It helps manage users, companies, job postings, and job applications through REST APIs.

## 🚀 Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Express.js
- JSON Web Token (JWT)
- bcryptjs
- dotenv

## 📁 Project Structure

```text
HireFlow/
│
├── src/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── seed/
│   └── app.js
│
├── postman/
├── server.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

## ✨ Main Features

- User registration and login
- Password hashing using bcryptjs
- JWT-based authentication
- Refresh token functionality
- Role-based access control
- Company management
- Job creation and management
- Job application submission
- Application status management
- Admin management APIs

## 👥 User Roles

| Role | Responsibilities |
|---|---|
| Admin | Manage users, companies, and platform operations |
| Recruiter | Manage companies, jobs, and applications |
| Candidate | Browse jobs and apply for jobs |

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jhabhavesh635-arch/HireFlow.git
```

### 2. Open the Project

```bash
cd HireFlow
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=1240
MONGODB_URL=mongodb://127.0.0.1:27017/hireflow
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

ADMIN_NAME=HireFlow Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

Use your own secret values and admin credentials. Never upload your actual `.env` file to GitHub.

### 5. Start MongoDB

Make sure your MongoDB server is running locally.

### 6. Run the Project

```bash
node server.js
```

The server will run on:

```text
http://localhost:1240
```

## 🔗 API Routes

| Module | Base Route |
|---|---|
| Authentication | `/api/auth` |
| Companies | `/api/companies` |
| Jobs | `/api/jobs` |
| Applications | `/api/applications` |
| Admin | `/
=======
>>>>>>> a259168a4c639677aaf1c60b1d77ed37cf5ce3d3
