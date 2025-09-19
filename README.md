# Backend System for a Virtual Event Management Platform

This repository contains the solution for the **AirTribe Assignment: Backend System for a Virtual Event Management Platform**. The project provides a backend API for managing users, events, and bookings, designed for virtual event hosting platforms. It demonstrates core backend engineering skills, including authentication, role-based access, data validation, RESTful API design, middleware usage, and in-memory persistence.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Important Notes](#important-notes)
- [Author](#author)

---

## Project Overview

The backend system allows users to register/login, view and book events, and provides administrators with privileged actions to create, update, and delete events. All data is stored in-memory for demonstration and testing purposes. The solution showcases robust validation, secure authentication, and RESTful principles.

---

## Features

- **User Registration and Login**
  - Secure password hashing using bcrypt.
  - JWT-based authentication for route protection.
  - Role assignment: users with emails ending in `@event.in` are admins.

- **Event Management**
  - Create, update, delete events (admin only).
  - List all events (open to all authenticated users).
  - Event details include name, description, date, time, location, and participants.

- **Booking System**
  - Users can register for events.
  - Prevents duplicate bookings.

- **Input Validation**
  - Strict checks on email format, password complexity, event details, date (`DD-MM-YYYY`), and time (`HH:MM`, 24-hour).

- **Middleware**
  - Centralized error handling and request/response logging.
  - Rate limiting to control API abuse.
  - Security headers via Helmet.

- **Testing**
  - Comprehensive test cases for users, events, and booking APIs using Jest and Supertest.

---

## API Endpoints

### Users

- `POST /users/register`  
  Register a new user.  
  **Body:** `{ name, email, password }`

- `POST /users/login`  
  Login with email and password.  
  **Body:** `{ email, password }`  
  **Response:** JWT token

### Events

- `GET /events/`  
  List all events.

- `POST /events/`  
  Create a new event (**admin only**).  
  **Body:** `{ event_name, description, date, time, location }`

- `PUT /events/:event_id`  
  Update event details (**admin only**).

- `DELETE /events/:event_id`  
  Delete an event (**admin only**).

### Bookings

- `POST /bookings/:event_id`  
  Register for an event.
  
- `PUT /bookings/:booking_id/cancel`  
  Cancel a registed event.  

- `GET /bookings/`  
  List all registed events.

---

## Technology Stack

- **Node.js** & **Express.js** — Backend & API framework
- **Jest** & **Supertest** — Testing
- **bcrypt** — Password hashing
- **jsonwebtoken** — JWT authentication
- **Helmet** — Security headers
- **CORS** — Cross-Origin Resource Sharing
- **express-rate-limit** — Rate limiting

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KIRAN-MISKIN/airtribe-task-3.git
cd airtribe-task-3
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and set:
```

X_API_KEY=your_api_key_here

PORT = your_port_number

JWT_SECRET = your_jwt_secret

TOKEY_EXPIREY = your_jwt_token_expirey

EMAIL_USER = your_notification_email_id

EMAIL_PASS = your_emails_app_password

```

### 4. Run the Server

```bash
npm start
```

### 5. Run Tests

```bash
npm test
```

---

## Project Structure

```
├── app.js                   # Main Express app setup
├── controller/              # Business logic for users, events, bookings
├── data/inMemoryStore.js    # In-memory storage for users, events, bookings
├── middleware/              # Auth, logging, error handling, rate limiting
├── router/                  # Express route definitions
├── utils/                   # Validation, ID generation, event emitter, etc.
├── test/                    # Jest & Supertest test suites
└── ...
```

---

## Testing

The repository includes automated tests for all main functionalities:
- User registration/login
- Event creation/listing/booking
- Auth and role-based restrictions
Run with `npm test`.

---

## Important Notes

- **Admin Role:** Users with emails ending in `@event.in` are given admin privileges automatically.
- **In-Memory Data:** All user, event, and booking data is reset on server restart (no database).
- **Validation:** All incoming data is strictly validated. See `utils/validations.js` for details.
- **Assignment Goal:** Demonstrate backend design, RESTful API, validation, authentication, middleware, and testing.

---

## Author

- [KIRAN-MISKIN](https://github.com/KIRAN-MISKIN)
