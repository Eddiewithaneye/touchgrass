# TouchGrass Backend API

A Flask-based REST API for the TouchGrass scavenger hunt application with AI-powered image verification using Google's Gemini API.

## Features

- **User Authentication**: Secure signup, login, and session management
- **Session Management**: Cryptographically secure tokens with 7-day expiration
- **Image Verification**: AI-powered image analysis using Google Gemini 2.5 Flash
- **Rate Limiting**: Protection against abuse (optional, requires flask-limiter)
- **SQLite Database**: Lightweight storage for users, images, and sessions
- **CORS Support**: Configurable cross-origin requests for frontend integration

## Prerequisites

- Python 3.8+
- Google Gemini API key (for image verification)

## Setup

1. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

2. **Create a `.env` file in the api directory:**
```env
# Required
API_KEY=your_gemini_api_key_here

# Optional (defaults shown)
DATABASE_PATH=touchgrass.db
SECRET_KEY=auto_generated_if_not_set
FRONTEND_URL=http://localhost:3001
FLASK_DEBUG=True
PORT=5000
```

3. **Run the Flask server:**
```bash
python app.py
```

The server will start on `http://localhost:5000` (or your configured PORT)

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| GET | `/api/auth/verify` | Verify session token | ✅ |

### Images

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/images/upload` | Upload scavenger hunt image | ✅ |
| GET | `/api/images/user` | Get user's image submissions | ✅ |
| DELETE | `/api/images/<id>` | Delete specific image | ✅ |

### Analysis

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/analyze` | Analyze image with AI verification | ❌ |

### General

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check | ❌ |
| GET | `/api/user/stats` | Get user statistics | ✅ |

## Database Schema

### Users Table
```sql
id              INTEGER PRIMARY KEY
email           TEXT UNIQUE NOT NULL
password_hash   TEXT NOT NULL
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
last_login      TIMESTAMP
```

### Images Table
```sql
id              INTEGER PRIMARY KEY
user_id         INTEGER NOT NULL (FK -> users.id)
prompt          TEXT NOT NULL
image_data      TEXT (base64 encoded)
status          TEXT DEFAULT 'pending' ('success', 'failure', 'pending')
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Sessions Table
```sql
id              INTEGER PRIMARY KEY
user_id         INTEGER NOT NULL (FK -> users.id)
session_token   TEXT UNIQUE NOT NULL
expires_at      TIMESTAMP NOT NULL
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## Authentication

Protected endpoints require an `Authorization` header with the session token:
```http
Authorization: Bearer <session_token>
```

Session tokens:
- Expire after 7 days
- Are cryptographically secure (32-byte URL-safe tokens)
- Are automatically cleaned up when expired

## Image Verification

The API uses Google's Gemini 2.5 Flash model for intelligent image verification:

**POST /analyze**
```bash
curl -X POST http://localhost:5000/analyze \
  -F "file=@image.png" \
  -F "description=a red car"
```

Response:
```json
{
  "message": "Match explanation",
  "challenge_success": true
}
```

The AI analyzes images with structured output:
- Returns YES/NO answer with explanation
- Uses Pydantic models for type-safe responses
- Rate limited to 10 calls per 60 seconds

## Rate Limiting

Rate limits (when flask-limiter is installed):
- Signup: 5 per hour
- Login: 10 per minute
- Image upload: 20 per hour
- Default: 200 per day, 50 per hour

## Security Features

- ✅ PBKDF2-SHA256 password hashing
- ✅ Secure session token generation
- ✅ SQL injection prevention (parameterized queries)
- ✅ Rate limiting to prevent abuse
- ✅ CORS protection (configurable origins)
- ✅ Input validation and sanitization
- ✅ Session expiration and cleanup

## Dependencies

Core dependencies:
```
flask
flask-cors
werkzeug
python-dotenv
google-genai
ratelimit
pydantic
```

Optional dependencies:
```
flask-limiter  # For rate limiting
```

## Development

**Debug Mode:**
Set `FLASK_DEBUG=True` in `.env` to enable:
- Auto-reload on code changes
- Detailed error messages
- Unrestricted CORS

**Production:**
Set `FLASK_DEBUG=False` and configure:
- Specific FRONTEND_URL origins
- Strong SECRET_KEY
- Use a production WSGI server (e.g., Gunicorn)
```bash
# Production example
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## File Structure
```
api/
├── app.py                 # Main Flask application
├── ImageIdentifier.py     # Gemini AI image verification
├── touchgrass.db         # SQLite database (auto-created)
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (create this)
└── README.md            # This file
```

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## Troubleshooting

**"WARNING: flask-limiter not installed"**
- Rate limiting is optional. Install with: `pip install flask-limiter`

**"WARNING: python-dotenv not installed"**
- `.env` loading is optional. Install with: `pip install python-dotenv`

**Database initialization fails**
- Ensure write permissions in the api directory
- Delete `touchgrass.db` and restart to recreate

**API key errors**
- Verify `API_KEY` is set in `.env`
- Check Gemini API key is valid at https://aistudio.google.com/

## 📄 License

MIT License - feel free to use, modify, and share!

Built for KnightHacksVIII 2025
