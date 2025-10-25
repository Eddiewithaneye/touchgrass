# TouchGrass Backend API

A Flask-based REST API for the TouchGrass scavenger hunt application.

## Features

- User authentication (signup, login, logout)
- Session management with secure tokens
- SQLite database for user and image data
- Image upload and management
- CORS enabled for frontend integration

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Flask server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify session token

### Images
- `POST /api/images/upload` - Upload scavenger hunt image
- `GET /api/images/user` - Get user's images

### General
- `GET /api/health` - Health check
- `GET /api/stats` - Get application statistics

## Database Schema

### Users Table
- `id` - Primary key
- `email` - User email (unique)
- `password_hash` - Hashed password
- `created_at` - Registration timestamp

### Images Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `prompt` - Scavenger hunt prompt
- `image_data` - Base64 encoded image (optional)
- `status` - success/failure
- `created_at` - Upload timestamp

### Sessions Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `session_token` - Secure session token
- `expires_at` - Token expiration
- `created_at` - Session creation timestamp

## Authentication

All protected endpoints require an `Authorization` header with the session token:
```
Authorization: Bearer <session_token>