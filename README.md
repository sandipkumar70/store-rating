# Store Rating System

A web application where users can rate stores from 1 to 5.
There is one login for everyone, and the pages change according to the user's role.

## Tech Stack
- Backend: Node.js, Express
- Database: PostgreSQL
- Frontend: React (Vite)
- Auth: JWT and bcrypt

## Roles and Features

**System Administrator**
- Dashboard with total users, total stores and total ratings
- Add new users (admin, normal user, store owner) and new stores
- View stores list (name, email, address, rating)
- View users list (name, email, address, role)
- Filter users by name, email, address and role
- View a user's details (store owners also show their rating)
- Sorting on table columns

**Normal User**
- Sign up and log in
- View all stores and search by name or address
- Submit a rating (1 to 5) and change it later
- Update password

**Store Owner**
- Log in and update password
- Dashboard with the store's average rating and the list of users who rated it

## Form Validations
- Name: 20 to 60 characters
- Address: maximum 400 characters
- Password: 8 to 16 characters, at least 1 uppercase letter and 1 special character
- Email: standard email format

Validations are checked on both frontend and backend.

## How to Run

1. Create a PostgreSQL database named `stores_rating`.
2. Run the SQL in `backend/schema.sql` to create the tables.
3. Backend:
```
   cd backend
   npm install
```
   Create a `.env` file inside `backend`:
```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=stores_rating
   JWT_SECRET=any_long_secret_text
```
   Then run `npm run dev`.
4. Frontend:
```
   cd frontend
   npm install
   npm run dev
```
5. Open http://localhost:5173

## Creating the first admin
Sign up normally, then run this in PostgreSQL:
```
UPDATE users SET role = 'admin' WHERE email = 'your_email';
```

## Project Structure
```
backend/   config, controllers, middleware, routes, server.js, schema.sql
frontend/  src/pages (Login, Signup, Stores, Admin, Owner, Password)
```