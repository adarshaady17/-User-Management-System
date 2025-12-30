# User Management System

A full-stack web application for managing user accounts with role-based access control (RBAC), authentication, and user lifecycle management.

## Project Overview & Purpose

This User Management System is a complete web application built as an assessment project that demonstrates full-stack development skills. The system allows administrators to manage users (view, activate, deactivate) and enables regular users to manage their own profiles (update information, change passwords). 

The application implements secure authentication using JWT tokens, role-based access control, comprehensive input validation, and provides a modern, responsive user interface that works seamlessly on both desktop and mobile devices.

### Key Features

- ✅ **User Authentication**: Secure signup and login with JWT tokens
- ✅ **Role-Based Access Control**: Admin and User roles with different permissions
- ✅ **User Management**: Admins can view all users with pagination, activate, and deactivate accounts
- ✅ **Profile Management**: Users can update their profile information and change passwords
- ✅ **Pagination**: Efficient data display with pagination support (10 users per page)
- ✅ **Input Validation**: Comprehensive client and server-side validation
- ✅ **Error Handling**: Consistent error response format with proper HTTP status codes
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✅ **Toast Notifications**: Success/error/info notifications for user feedback
- ✅ **Modal Dialogs**: Confirmation dialogs for critical actions
- ✅ **Loading States**: Visual feedback during API calls
- ✅ **Protected Routes**: Authentication and role-based route protection
- ✅ **Unit Tests**: Backend testing with Jest and Supertest

## Tech Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Testing**: Jest + Supertest
- **Environment Management**: dotenv

### Frontend
- **Framework**: React 19 (with Hooks)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: CSS3 with modern design patterns

### Deployment
- **Backend**: Render / Railway / Heroku / Vercel
- **Frontend**: Vercel / Netlify
- **Database**: MongoDB Atlas (Cloud-hosted)

## Project Structure

```
User Management System/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   └── user.controller.js    # User management logic
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT authentication
│   │   ├── role.middleware.js    # Role-based access control
│   │   ├── validation.middleware.js # Input validation
│   │   └── error.middleware.js    # Error handling
│   ├── models/
│   │   └── User.model.js         # User schema
│   ├── routes/
│   │   ├── auth.routes.js        # Authentication routes
│   │   └── user.routes.js        # User routes
│   ├── utils/
│   │   └── jwt.js                # JWT token generation
│   ├── validators/
│   │   ├── auth.validator.js     # Auth validation rules
│   │   └── user.validator.js     # User validation rules
│   ├── tests/
│   │   ├── auth.test.js          # Auth unit tests
│   │   └── user.test.js          # User unit tests
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   ├── package.json
│   ├── jest.config.js
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios configuration
│   │   ├── auth/
│   │   │   └── AuthContext.jsx    # Authentication context
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   ├── Toast.jsx         # Toast notifications
│   │   │   ├── ToastContainer.jsx # Toast container
│   │   │   └── Modal.jsx         # Modal dialogs
│   │   ├── hooks/
│   │   │   └── useToast.js       # Toast hook
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Signup.jsx        # Signup page
│   │   │   ├── AdminDashboard.jsx # Admin dashboard
│   │   │   └── UserProfile.jsx    # User profile page
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)
- Git

### Creating Your First Admin User

**Important:** You need an admin user to access the admin dashboard. Here are your options:

1. **Automatic (Easiest):** The **first user** you create through the signup page will automatically be assigned the **admin** role. Just sign up first!

2. **Using Script:** Run the create-admin script:
   ```bash
   cd backend
   npm run create-admin
   ```
   This creates an admin with email `admin@example.com` and password `Admin1234`

3. **Custom Admin:** Create admin with custom credentials:
   ```bash
   npm run create-admin <email> <password> <fullName>
   ```

For more details, see `backend/README_ADMIN_SETUP.md`

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the `backend` directory (you can copy from `env.example`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The backend server will run on `http://localhost:5000`

5. **Run tests (optional):**
   ```bash
   npm test
   ```

   Run tests with coverage:
   ```bash
   npm test -- --coverage
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (Vite default port)

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

**Note**: Never commit `.env` files to version control. They are excluded via `.gitignore`.

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Email already exists",
      "param": "email"
    }
  ]
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active",
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### GET `/api/auth/me`
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active",
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

### User Management Endpoints (Admin Only)

#### GET `/api/users?page=1&limit=10`
Get all users with pagination.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### PUT `/api/users/:id/status`
Activate or deactivate a user.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "status": "active"
}
```
or
```json
{
  "status": "inactive"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User activated successfully",
  "user": {
    "_id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active"
  }
}
```

### User Profile Endpoints

#### PUT `/api/users/profile`
Update user profile (full name and email).

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "fullName": "John Updated",
  "email": "john.updated@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "fullName": "John Updated",
    "email": "john.updated@example.com",
    "role": "user",
    "status": "active"
  }
}
```

#### PUT `/api/users/change-password`
Change user password.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

## Database Schema

### User Model

```javascript
{
  fullName: String (required, 2-50 characters),
  email: String (required, unique, lowercase),
  password: String (required, hashed with bcrypt),
  role: String (enum: ["admin", "user"], default: "user"),
  status: String (enum: ["active", "inactive"], default: "active"),
  lastLogin: Date,
  createdAt: Date (auto-managed),
  updatedAt: Date (auto-managed)
}
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds of 10
- **JWT Authentication**: Secure token-based authentication with configurable expiration
- **Input Validation**: Server-side validation using express-validator for all endpoints
- **CORS Configuration**: Secure cross-origin resource sharing with configurable allowed origins
- **Protected Routes**: Middleware-based route protection with authentication verification
- **Role-Based Access Control**: Admin and user role separation with middleware enforcement
- **Error Handling**: Consistent error response format with proper HTTP status codes
- **Environment Variables**: Sensitive data stored in `.env` files (excluded from git)

## Testing

### Backend Tests

The backend includes comprehensive unit tests using Jest and Supertest.

**Run all tests:**
```bash
cd backend
npm test
```

**Run tests with coverage:**
```bash
npm test -- --coverage
```

### Test Coverage

The backend includes unit tests for:
- ✅ User signup with validation (email format, password strength, duplicate email)
- ✅ User login with authentication (valid credentials, invalid credentials, inactive account)
- ✅ Admin user management (get all users with pagination, update user status)
- ✅ Profile updates (update full name and email, email uniqueness validation)
- ✅ Password changes (correct current password, incorrect current password)
- ✅ Role-based access control (admin-only endpoints, unauthorized access)

**Test Files:**
- `backend/tests/auth.test.js` - Authentication tests
- `backend/tests/user.test.js` - User management tests

## Deployment Instructions

### Backend Deployment (Render/Railway/Heroku)

1. **Create a new service** on Render, Railway, or Heroku
2. **Connect your GitHub repository**
3. **Set environment variables:**
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key (generate using: `openssl rand -base64 32`)
   - `JWT_EXPIRES_IN`: Token expiration (e.g., "7d")
   - `FRONTEND_URL`: Your frontend deployment URL
   - `NODE_ENV`: "production"
   - `PORT`: (Usually auto-set by platform)

4. **Build settings:**
   - Build command: `npm install`
   - Start command: `npm start`
   - Root directory: `backend`

5. **Deploy** and note your backend API URL

### Frontend Deployment (Vercel/Netlify)

1. **Create a new project** on Vercel or Netlify
2. **Connect your GitHub repository**
3. **Set environment variables:**
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.onrender.com/api`)

4. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Root directory: `frontend`

5. **Deploy** and note your frontend URL

### Database Setup (MongoDB Atlas)

1. **Create a MongoDB Atlas account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a new cluster** (free tier available)
3. **Create a database user:**
   - Go to Database Access
   - Add new database user
   - Set username and password
4. **Whitelist IP addresses:**
   - Go to Network Access
   - Add IP address (0.0.0.0/0 for development, specific IPs for production)
5. **Get connection string:**
   - Go to Clusters
   - Click Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Use this in your `MONGO_URI` environment variable

### Deployment Checklist

- [ ] Backend deployed and accessible via public URL
- [ ] Frontend deployed and accessible via public URL
- [ ] MongoDB Atlas cluster created and accessible
- [ ] Environment variables set on both frontend and backend
- [ ] CORS configured to allow frontend URL
- [ ] All endpoints tested and working
- [ ] Authentication flow tested
- [ ] Admin and user roles tested
- [ ] Responsive design tested on mobile devices

## Usage Guide

### For Administrators

1. **Login** with admin credentials
2. **View Dashboard**: See all users in a paginated table with:
   - Email address
   - Full name
   - Role (admin/user)
   - Status (active/inactive)
   - Last login timestamp
   - Actions (activate/deactivate buttons)
3. **Manage Users**: 
   - Click "Activate" to activate an inactive user
   - Click "Deactivate" to deactivate an active user
   - Confirmation dialog appears before action
   - Success/error notifications displayed
4. **Navigate**: Use navbar to access profile or logout

### For Regular Users

1. **Signup**: Create a new account with:
   - Full name (minimum 2 characters)
   - Email address (valid format required)
   - Password (minimum 8 characters with uppercase, lowercase, and number)
   - Confirm password (must match)
2. **Login**: Access your account with email and password
3. **View Profile**: See your account information including:
   - Full name
   - Email address
   - Role
   - Status
4. **Edit Profile**: Update your full name and email address
5. **Change Password**: Update your password with:
   - Current password verification
   - New password (with strength requirements)
   - Password confirmation
6. **Navigate**: Use navbar to access profile or logout

## Features Implemented

### Backend Features
✅ User signup with email validation and password strength requirements  
✅ User login with credentials verification  
✅ JWT-based authentication with token generation  
✅ Protected routes with authentication verification  
✅ Role-based access control (admin/user)  
✅ Admin: View all users with pagination (10 per page)  
✅ Admin: Activate user accounts  
✅ Admin: Deactivate user accounts  
✅ User: View own profile information  
✅ User: Update full name and email  
✅ User: Change password with current password verification  
✅ Password hashing with bcryptjs  
✅ Input validation on all endpoints  
✅ Consistent error response format  
✅ Proper HTTP status codes  
✅ Environment variables for sensitive data  
✅ CORS configuration for secure API access  
✅ Unit tests (5+ tests)  

### Frontend Features
✅ Login page with email and password inputs  
✅ Client-side form validation  
✅ Redirect to dashboard on success  
✅ Error message display  
✅ Link to signup page  
✅ Signup page with full name, email, password, confirm password  
✅ Required field validation  
✅ Email format validation  
✅ Password strength validation  
✅ Password confirmation matching  
✅ Server-side error display  
✅ Redirect to login on success  
✅ Admin dashboard with table displaying all users  
✅ Columns: email, full name, role, status, actions  
✅ Pagination (10 users per page)  
✅ Activate user button  
✅ Deactivate user button  
✅ Confirmation dialog before actions  
✅ Success/error notifications  
✅ User profile page displaying user information  
✅ Edit full name and email  
✅ Change password section  
✅ Save and cancel buttons  
✅ Success/error messages after updates  
✅ Navigation bar displaying logged-in user name  
✅ Display user role  
✅ Role-based navigation links  
✅ Logout button  
✅ Redirect to login after logout  
✅ Protected routes preventing unauthenticated access  
✅ Admin-only pages restricted to admins  
✅ Redirect to login for unauthorized users  
✅ Input fields with validation messages  
✅ Primary action buttons  
✅ Secondary action buttons  
✅ Destructive action buttons  
✅ Loading spinners during API calls  
✅ Toast notifications (success/error/info)  
✅ Modal dialogs for confirmations  
✅ Pagination for tables  
✅ Clear error messages  
✅ Responsive design (desktop & mobile)  

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|----------------|--------------|
| POST | `/api/auth/signup` | Create new user | No | - |
| POST | `/api/auth/login` | Login user | No | - |
| GET | `/api/auth/me` | Get current user | Yes | - |
| GET | `/api/users` | Get all users (paginated) | Yes | Admin |
| PUT | `/api/users/:id/status` | Update user status | Yes | Admin |
| PUT | `/api/users/profile` | Update profile | Yes | - |
| PUT | `/api/users/change-password` | Change password | Yes | - |

## Future Enhancements

- Email verification on signup
- Password reset functionality
- User activity logs
- Advanced filtering and search
- Bulk user operations
- Export user data (CSV/Excel)
- Two-factor authentication (2FA)
- User profile pictures
- Audit trail for admin actions
- Rate limiting for API endpoints
- API documentation with Swagger/OpenAPI

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify `MONGO_URI` is correct in `.env`
   - Check MongoDB Atlas network access settings
   - Ensure database user credentials are correct

2. **CORS Errors**
   - Verify `FRONTEND_URL` in backend `.env` matches frontend URL
   - Check that frontend is using correct `VITE_API_URL`

3. **JWT Token Errors**
   - Verify `JWT_SECRET` is set in backend `.env`
   - Check token expiration settings
   - Ensure token is being sent in Authorization header

4. **Port Already in Use**
   - Change `PORT` in backend `.env`
   - Or kill the process using the port

## License

This project is created for assessment purposes.

## Contact

For questions or issues, please contact the development team.

---

**Note**: Make sure to keep your `.env` files secure and never commit them to version control. Use `.env.example` files as templates.

## Deployment Files

- `render.yaml` - Render deployment configuration
- `frontend/vercel.json` - Vercel deployment configuration
- `DEPLOYMENT.md` - Complete deployment guide

**Live Deployment Links** (Update after deployment):
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend-url.onrender.com/api`
- Health Check: `https://your-backend-url.onrender.com/health`
