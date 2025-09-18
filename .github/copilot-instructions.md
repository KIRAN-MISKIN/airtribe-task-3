# Copilot Instructions for Airtribe Backend

## Project Overview
This project is a **production-grade backend** for a virtual event management platform (Airtribe).
It is built with **Node.js, Express.js**, and includes features like:
- User authentication (bcrypt + JWT)
- Event management (CRUD operations)
- Participant registration
- Email notifications for booking confirmation
- Centralized error handling
- Logging with Winston & Morgan
- Rate limiting, security middlewares (helmet, cors)

## What I want from Copilot
- Review code for **best practices** in backend architecture and API structure.
- Suggest improvements for:
  - Security (JWT handling, password hashing, input validation, headers, rate limiting)
  - Logging (consistency, log levels, sensitive data exposure)
  - Error handling (central error middleware, response structure)
  - Performance (query optimization, caching opportunities, load testing strategy)
- Flag any **anti-patterns** or code smells in controllers, middlewares, or routes.
- Recommend **test coverage improvements** (unit tests, integration tests).
- Highlight any **production-readiness gaps** (e.g., env management, CI/CD, monitoring).

## Style & Conventions
- Use **ESLint + Prettier** conventions (airbnb/base style preferred).
- Maintain RESTful API design principles.
- Ensure all responses follow a consistent JSON format: `{ success, message, data, error }`.

## What NOT to do
- Don’t auto-generate boilerplate explanations in every file.
- Don’t rewrite the entire codebase.
- Don’t suggest frontend-related changes (this is backend-only).
- Avoid unnecessary dependencies unless they solve a clear problem.

---

### Example Review Request
When reviewing a Pull Request, Copilot should:
1. Point out any security flaws (e.g., storing JWT secret in code, missing validation).
2. Suggest performance optimizations (e.g., indexes in Prisma schema).
3. Check for error-handling consistency across routes.
4. Flag potential bugs in async/await handling.
5. Ensure logs don’t expose sensitive data (like passwords, tokens).
