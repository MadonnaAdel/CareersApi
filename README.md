# 📦 Careers API

This is a RESTful API built using **Node.js**, **Express**, and **MongoDB** for managing job postings and applications. It supports both **companies** and **users** through secure authentication and structured endpoints.

---

## 📚 Features

- 🧑‍💼 Company registration, login, and job management  
- 👤 User signup/login with ability to save or apply to jobs  
- 📂 File uploads using Multer (e.g., company logos or resumes)  
- 🔐 JWT authentication for users and companies  
- 📬 Email integration using Nodemailer  
- 📝 Swagger API Documentation (`/api-docs`)  
- 🔒 Password hashing using bcrypt  
- 🌐 CORS enabled  
- 🧱 Modular and scalable project structure  

---

## 🧠 Tech Stack & Libraries

| Package                   | Description                                      |
|--------------------------|--------------------------------------------------|
| express                  | Web server and routing framework                |
| mongoose                 | MongoDB ODM (Object Document Mapper)            |
| bcrypt / bcryptjs        | Password hashing and verification               |
| jsonwebtoken             | JWT-based authentication                       |
| cookie-parser            | To parse cookies                                |
| multer                   | Handling multipart/form-data (file uploads)     |
| nodemailer               | Email sending                                   |
| nodemailer-smtp-transport| SMTP config for email transport                 |
| dotenv                   | Load environment variables                      |
| cors                     | Enable Cross-Origin Resource Sharing            |
| swagger-jsdoc            | Generate Swagger docs from JSDoc comments       |
| swagger-ui-express       | Serve Swagger docs UI                           |
| path                     | File and directory path utilities               |
| nodemon                  | Auto-restarting the server during development   |

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the repo

```bash
git clone https://github.com/MadonnaAdel/CareersApi.git
cd CareersApi
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3001
USERNAME=YourData
PASSWORD=YourData
MONGO=YourData
JWT_SECRET=YourData
EMAIL=YourData for nodemailer
EMAIL_PASSWORD=YourData for nodemailer
```


### 4. Run the server

#### In development mode (with nodemon):
```bash
npm run serve
```

#### Or, normal mode:
```bash
npm start
```

### 5. Access the API

- Base URL: `http://localhost:3001/api`
- Swagger Docs: `http://localhost:3001/api-docs`

---

## 🌍 Live Deployment

The API is deployed on Vercel:  
🔗 [careers-api-six.vercel.app](https://careers-api-six.vercel.app)

📃 Swagger API Documentation  
Interactive documentation available at:  
👉 [Swagger UI](https://editor.swagger.io/?url=https://raw.githubusercontent.com/MadonnaAdel/careersAPI-swagger-docs/refs/heads/main/swagger.json)
