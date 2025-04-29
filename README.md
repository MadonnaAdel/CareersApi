# 💼 Careers - Job Portal API

This is a RESTful API built using Node.js, Express, and MongoDB for managing job postings and applications. The API is designed for both companies (to post and manage jobs) and users (to apply and save jobs).

---

## 📚 Features

- 🧑‍💼 Company registration, login, and job management
- 👤 User signup/login and ability to save or apply to jobs
- 📂 File uploads using Multer (e.g., company logos or resumes)
- 🛡️ JWT authentication for users and companies
- 📬 Email integration using Nodemailer
- 📃 Swagger API Documentation (`/api-docs`)
- 🔒 Password hashing using bcrypt
- 🌐 CORS enabled
- 📦 Modular and scalable project structure

---

## 📦 Tech Stack & Libraries

| Package                  | Description                                                   |
|--------------------------|---------------------------------------------------------------|
| **express**              | Web server and routing framework                             |
| **mongoose**             | MongoDB ODM (Object Document Mapper)                         |
| **bcrypt / bcryptjs**    | Password hashing and verification                            |
| **jsonwebtoken**         | JWT-based authentication                                     |
| **cookie-parser**        | To parse cookies                                              |
| **multer**               | Handling multipart/form-data (file uploads)                  |
| **nodemailer**           | Email sending (e.g., confirmation or notification emails)     |
| **nodemailer-smtp-transport** | SMTP configuration for email transport               |
| **dotenv**               | Load environment variables from `.env` file                  |
| **cors**                 | Enable Cross-Origin Resource Sharing                         |
| **swagger-jsdoc**        | Generate Swagger docs from JSDoc comments                    |
| **swagger-ui-express**   | Serve interactive Swagger docs at `/api-docs`                |
| **path**                 | Utilities for working with file and directory paths          |
| **nodemon**              | Development tool for auto-restarting the server              |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/job-portal-api.git
cd job-portal-api
