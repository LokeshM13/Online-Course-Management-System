# Learnspace — Online Course Management System

A responsive course platform with student authentication, course discovery, enrollment, lesson progress, and an admin dashboard.

## Stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express, JWT, bcrypt
- **Database:** MongoDB with Mongoose

## Requirements

- Node.js 18+
- MongoDB locally or a MongoDB Atlas connection string

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` and a long, random `JWT_SECRET`.
2. Copy `frontend/.env.example` to `frontend/.env` if the API is not at `http://localhost:5001/api`.
3. Install dependencies:

   ```sh
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

4. Start MongoDB, then run `npm run dev` from the project root. The frontend is at `http://localhost:5173`; the API is at `http://localhost:5001`.
5. Register a student account from the UI. To create an administrator, set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `backend/.env` and run `npm run seed:admin --prefix backend`. Admin accounts cannot be created through public registration. To add the bundled sample catalog, sign in with an administrator account and run `npm run seed:demo --prefix backend`; this command can be rerun safely.

## API overview

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public; creates a student |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Signed in |
| GET | `/api/courses?search=&category=&level=` | Public; search matches partial words case-insensitively in course titles |
| GET | `/api/courses/:id` | Public |
| POST, PUT, DELETE | `/api/courses[/:id]` | Admin |
| POST | `/api/enrollments` | Student |
| GET | `/api/enrollments/my` | Student |
| GET | `/api/enrollments/:id` | Owner or admin |
| GET, PUT | `/api/progress/:courseId` | Enrolled student |
| GET | `/api/admin/dashboard` | Admin |
| GET | `/api/admin/users` | Admin |
| GET | `/api/admin/enrollments` | Admin |

Authenticated routes accept `Authorization: Bearer <token>`. Progress updates accept `{ "lessonId": "...", "completed": true }`; completion percentage is computed by the API.

## Deployment notes

- **Frontend:** deploy `frontend/` to Vercel and set `VITE_API_URL` to the deployed API's `/api` URL.
- **Backend:** deploy `backend/` to Render with `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, and `PORT` environment variables. Configure the health-check path as `/api/health`. The API defaults to port `5001` locally to avoid macOS Control Center's use of port `5000`.
- **Database:** use MongoDB Atlas and restrict network access to the backend deployment where possible.
- Run the admin seed command once in a trusted environment. Do not commit `.env` files or expose `ADMIN_PASSWORD` in a deployed frontend.

## Author

**Lokesh m**  
Full Stack Web Developer
Mysore Karnataka india 
