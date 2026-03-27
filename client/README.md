# MERN Authentication & Password Reset

A modern authentication system built with the MERN stack. Features a full password reset flow with secure token hashing, rate limiting, and a sleek glassmorphism UI.

## Features

- **Secure Authentication**: Sign up and sign in using JWT-based auth.
- **Password Reset**: Full forgot password flow with secure, expiring email links and token hashing.
- **Security Hardened**:
  - Rate limiting on all auth endpoints.
  - Input validation with `express-validator`.
  - Secure headers with `helmet`.
  - Password salt rounds increased to 12.
- **Premium UI**: Modern glassmorphism design with:
  - Gradient backgrounds and blur effects.
  - Animated form transitions.
  - Password strength indicator and visibility toggle.
  - Custom toast notification system.
- **Layered Architecture**: Clean, scalable backend structure (controllers, middleware, utils).

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JSON Web Tokens (JWT), BcryptJS
- **Email**: NodeMailer

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:5173
CLIENT_URL=http://localhost:5173
APP_NAME=AuthApp
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Project

```bash
# Start server (from /server)
npm run dev

# Start client (from /client)
npm run dev
```

## Folder Structure

- `/server`: Express backend with Mongoose models and controllers.
- `/client`: Vite-powered React frontend with premium UI components.
