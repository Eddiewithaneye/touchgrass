from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import secrets
import datetime
import os
import re

# Try to import rate limiter, but make it optional
try:
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
    LIMITER_AVAILABLE = True
except ImportError:
    print("WARNING: flask-limiter not installed. Rate limiting disabled.")
    print("Install with: pip install flask-limiter")
    LIMITER_AVAILABLE = False

# Try to load dotenv, but make it optional
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("WARNING: python-dotenv not installed. Using default values.")
    print("Install with: pip install python-dotenv")

app = Flask(__name__)

# Configuration from environment variables with sensible defaults
DATABASE = os.getenv('DATABASE_PATH', 'touchgrass.db')
SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(32))
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
DEBUG_MODE = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'

# CORS configuration - restrict to specific origins
allowed_origins = [origin.strip() for origin in FRONTEND_URL.split(',')]
CORS(app, origins=allowed_origins, supports_credentials=True)

# Rate limiting (optional - only if flask-limiter is installed)
if LIMITER_AVAILABLE:
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["200 per day", "50 per hour"],
        storage_uri="memory://"
    )
else:
    # Create a dummy decorator that does nothing
    class DummyLimiter:
        def limit(self, *args, **kwargs):
            def decorator(f):
                return f
            return decorator
    limiter = DummyLimiter()

def get_db_connection():
    """Get database connection with Row factory for dict-like access"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initialize the database with required tables and indexes"""
    print(f"Initializing database at: {DATABASE}")
    
    try:
        conn = get_db_connection()
        
        # Create users table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                display_name TEXT NOT NULL,
                is_guest BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            )
        ''')
        
        # Add display_name and is_guest columns if they don't exist (for existing databases)
        try:
            conn.execute('ALTER TABLE users ADD COLUMN display_name TEXT')
        except sqlite3.OperationalError:
            pass  # Column already exists
            
        try:
            conn.execute('ALTER TABLE users ADD COLUMN is_guest BOOLEAN DEFAULT FALSE')
        except sqlite3.OperationalError:
            pass  # Column already exists
        
        # Create images table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                prompt TEXT NOT NULL,
                image_data TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        # Create sessions table for authentication
        conn.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                session_token TEXT UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        # Create indexes for better performance
        conn.execute('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
        conn.execute('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token)')
        conn.execute('CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)')
        conn.execute('CREATE INDEX IF NOT EXISTS idx_images_user ON images(user_id)')
        conn.execute('CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)')
        
        conn.commit()
        conn.close()
        
        print("Database initialized successfully!")
        print("Tables created: users, images, sessions")
        
    except Exception as e:
        print(f"Error initializing database: {str(e)}")
        raise

def validate_email(email):
    """Validate email format using regex"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def generate_session_token():
    """Generate a cryptographically secure session token"""
    return secrets.token_urlsafe(32)

def verify_session(session_token):
    """Verify session token and return user info if valid"""
    if not session_token:
        return None
    
    try:
        conn = get_db_connection()
        session = conn.execute('''
            SELECT s.user_id, u.email 
            FROM sessions s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.session_token = ? AND s.expires_at > datetime('now')
        ''', (session_token,)).fetchone()
        conn.close()
        
        if session:
            return {'user_id': session['user_id'], 'email': session['email']}
        return None
    except Exception as e:
        print(f"Error verifying session: {str(e)}")
        return None

def cleanup_expired_sessions():
    """Remove expired sessions from database"""
    try:
        conn = get_db_connection()
        result = conn.execute("DELETE FROM sessions WHERE expires_at < datetime('now')")
        deleted = result.rowcount
        conn.commit()
        conn.close()
        if deleted > 0:
            print(f"Cleaned up {deleted} expired sessions")
    except Exception as e:
        print(f"Error cleaning up sessions: {str(e)}")

def get_auth_token():
    """Extract and validate authorization token from request headers"""
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        return auth_header[7:]  # Remove 'Bearer ' prefix
    return None

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    print(f"Internal error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500

if LIMITER_AVAILABLE:
    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify API is running"""
    return jsonify({
        'status': 'healthy', 
        'message': 'TouchGrass API is running',
        'timestamp': datetime.datetime.now().isoformat(),
        'rate_limiting': LIMITER_AVAILABLE
    }), 200

# Authentication endpoints
@app.route('/api/auth/signup', methods=['POST'])
@limiter.limit("5 per hour")  # Strict rate limit for signup
def signup():
    """User registration endpoint with validation"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        display_name = data.get('displayName', '').strip()
        
        # Input validation
        if not email or not password or not display_name:
            return jsonify({'error': 'Email, password, and display name are required'}), 400
        
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        if len(password) < 8:
            return jsonify({'error': 'Password must be at least 8 characters'}), 400
        
        if len(password) > 128:
            return jsonify({'error': 'Password is too long (max 128 characters)'}), 400
        
        conn = get_db_connection()
        
        # Check if user already exists
        existing_user = conn.execute(
            'SELECT id FROM users WHERE email = ?', (email,)
        ).fetchone()
        
        if existing_user:
            conn.close()
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Create new user with secure password hashing
        password_hash = generate_password_hash(password, method='pbkdf2:sha256')
        cursor = conn.execute(
            'INSERT INTO users (email, password_hash, display_name, last_login) VALUES (?, ?, ?, datetime("now"))',
            (email, password_hash, display_name)
        )
        user_id = cursor.lastrowid
        
        # Create session
        session_token = generate_session_token()
        expires_at = datetime.datetime.now() + datetime.timedelta(days=7)
        
        conn.execute(
            'INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
            (user_id, session_token, expires_at)
        )
        
        conn.commit()
        conn.close()
        
        print(f"New user created: {email}")
        
        return jsonify({
            'message': 'User created successfully',
            'session_token': session_token,
            'user': {'id': user_id, 'email': email, 'displayName': display_name}
        }), 201
        
    except sqlite3.IntegrityError as e:
        print(f"Database integrity error in signup: {str(e)}")
        return jsonify({'error': 'Email already exists'}), 409
    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/login', methods=['POST'])
@limiter.limit("10 per minute")  # Rate limit to prevent brute force
def login():
    """User login endpoint with secure password verification"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        conn = get_db_connection()
        
        # Find user
        user = conn.execute(
            'SELECT id, email, password_hash, display_name FROM users WHERE email = ?', (email,)
        ).fetchone()
        
        # Use constant-time comparison to prevent timing attacks
        if not user or not check_password_hash(user['password_hash'], password):
            conn.close()
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Update last login
        conn.execute(
            'UPDATE users SET last_login = datetime("now") WHERE id = ?',
            (user['id'],)
        )
        
        # Create new session
        session_token = generate_session_token()
        expires_at = datetime.datetime.now() + datetime.timedelta(days=7)
        
        conn.execute(
            'INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
            (user['id'], session_token, expires_at)
        )
        
        conn.commit()
        conn.close()
        
        # Clean up old sessions periodically
        cleanup_expired_sessions()
        
        print(f"User logged in: {email}")
        
        return jsonify({
            'message': 'Login successful',
            'session_token': session_token,
            'user': {'id': user['id'], 'email': user['email'], 'displayName': user['display_name']}
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/guest', methods=['POST'])
@limiter.limit("10 per hour")  # Rate limit for guest creation
def create_guest():
    """Create a guest user account"""
    try:
        import random
        
        # Generate guest credentials
        guest_id = secrets.token_hex(8)
        guest_email = f"guest_{guest_id}@touchgrass.temp"
        guest_names = [
            'Anonymous Explorer', 'Mystery Hiker', 'Secret Naturalist', 'Hidden Wanderer',
            'Unknown Adventurer', 'Stealth Walker', 'Phantom Hunter', 'Shadow Seeker'
        ]
        display_name = f"{random.choice(guest_names)} #{guest_id[-4:]}"
        
        # Create a temporary password (not used for login)
        temp_password = secrets.token_hex(16)
        password_hash = generate_password_hash(temp_password, method='pbkdf2:sha256')
        
        conn = get_db_connection()
        
        cursor = conn.execute(
            'INSERT INTO users (email, password_hash, display_name, is_guest, last_login) VALUES (?, ?, ?, ?, datetime("now"))',
            (guest_email, password_hash, display_name, True)
        )
        user_id = cursor.lastrowid
        
        # Create session
        session_token = generate_session_token()
        expires_at = datetime.datetime.now() + datetime.timedelta(hours=24)  # Shorter session for guests
        
        conn.execute(
            'INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
            (user_id, session_token, expires_at)
        )
        
        conn.commit()
        conn.close()
        
        print(f"Guest user created: {display_name}")
        
        return jsonify({
            'message': 'Guest session created',
            'session_token': session_token,
            'user': {'id': user_id, 'email': guest_email, 'displayName': display_name}
        }), 201
        
    except Exception as e:
        print(f"Guest creation error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """User logout endpoint - invalidates session token"""
    try:
        session_token = get_auth_token()
        
        if not session_token:
            return jsonify({'error': 'Session token required'}), 400
        
        conn = get_db_connection()
        result = conn.execute(
            'DELETE FROM sessions WHERE session_token = ?', 
            (session_token,)
        )
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Logout successful'}), 200
        
    except Exception as e:
        print(f"Logout error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/verify', methods=['GET'])
def verify_auth():
    """Verify authentication token is valid"""
    try:
        session_token = get_auth_token()
        
        if not session_token:
            return jsonify({'error': 'Session token required'}), 401
        
        user_info = verify_session(session_token)
        
        if not user_info:
            return jsonify({'error': 'Invalid or expired session'}), 401
        
        return jsonify({
            'message': 'Session valid',
            'user': user_info
        }), 200
        
    except Exception as e:
        print(f"Verify auth error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Image/scavenger hunt endpoints
@app.route('/api/images/upload', methods=['POST'])
@limiter.limit("20 per hour")
def upload_image():
    """Upload image for scavenger hunt with authentication"""
    try:
        session_token = get_auth_token()
        
        if not session_token:
            return jsonify({'error': 'Authentication required'}), 401
        
        user_info = verify_session(session_token)
        if not user_info:
            return jsonify({'error': 'Invalid or expired session'}), 401
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        prompt = data.get('prompt', '').strip()
        image_data = data.get('image_data', '')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        if len(prompt) > 500:
            return jsonify({'error': 'Prompt is too long (max 500 characters)'}), 400
        
        # Limit image data size (5MB = ~6.7MB base64)
        if len(image_data) > 7000000:
            return jsonify({'error': 'Image data is too large (max 5MB)'}), 400
        
        conn = get_db_connection()
        
        # Simulate verification (replace with actual AI verification later)
        import random
        status = 'success' if random.random() > 0.2 else 'failure'
        
        cursor = conn.execute(
            'INSERT INTO images (user_id, prompt, image_data, status) VALUES (?, ?, ?, ?)',
            (user_info['user_id'], prompt, image_data, status)
        )
        
        image_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Image uploaded successfully',
            'image_id': image_id,
            'status': status,
            'success': status == 'success'
        }), 201
        
    except Exception as e:
        print(f"Upload image error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/images/user', methods=['GET'])
def get_user_images():
    """Get all images for authenticated user"""
    try:
        session_token = get_auth_token()
        
        if not session_token:
            return jsonify({'error': 'Authentication required'}), 401
        
        user_info = verify_session(session_token)
        if not user_info:
            return jsonify({'error': 'Invalid or expired session'}), 401
        
        conn = get_db_connection()
        images = conn.execute('''
            SELECT id, prompt, status, created_at 
            FROM images 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        ''', (user_info['user_id'],)).fetchall()
        conn.close()
        
        return jsonify({
            'images': [dict(image) for image in images]
        }), 200
        
    except Exception as e:
        print(f"Get user images error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/images/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):
    """Delete a specific image (user can only delete their own)"""
    try:
        session_token = get_auth_token()
        
        if not session_token:
            return jsonify({'error': 'Authentication required'}), 401
        
        user_info = verify_session(session_token)
        if not user_info:
            return jsonify({'error': 'Invalid or expired session'}), 401
        
        conn = get_db_connection()
        
        # Verify image belongs to user
        image = conn.execute(
            'SELECT user_id FROM images WHERE id = ?', (image_id,)
        ).fetchone()
        
        if not image:
            conn.close()
            return jsonify({'error': 'Image not found'}), 404
        
        if image['user_id'] != user_info['user_id']:
            conn.close()
            return jsonify({'error': 'Unauthorized to delete this image'}), 403
        
        conn.execute('DELETE FROM images WHERE id = ?', (image_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Image deleted successfully'}), 200
        
    except Exception as e:
        print(f"Delete image error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Statistics endpoint
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get general statistics (public endpoint)"""
    try:
        conn = get_db_connection()
        
        total_users = conn.execute('SELECT COUNT(*) as count FROM users').fetchone()['count']
        total_images = conn.execute('SELECT COUNT(*) as count FROM images').fetchone()['count']
        successful_hunts = conn.execute(
            'SELECT COUNT(*) as count FROM images WHERE status = "success"'
        ).fetchone()['count']
        
        conn.close()
        
        success_rate = round((successful_hunts / total_images * 100) if total_images > 0 else 0, 2)
        
        return jsonify({
            'total_users': total_users,
            'total_images': total_images,
            'successful_hunts': successful_hunts,
            'success_rate': success_rate
        }), 200
        
    except Exception as e:
        print(f"Get stats error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/user/stats', methods=['GET'])
def get_user_stats():
    """Get statistics for authenticated user"""
    try:
        session_token = get_auth_token()
        
        if not session_token:
            return jsonify({'error': 'Authentication required'}), 401
        
        user_info = verify_session(session_token)
        if not user_info:
            return jsonify({'error': 'Invalid or expired session'}), 401
        
        conn = get_db_connection()
        
        total = conn.execute(
            'SELECT COUNT(*) as count FROM images WHERE user_id = ?',
            (user_info['user_id'],)
        ).fetchone()['count']
        
        successful = conn.execute(
            'SELECT COUNT(*) as count FROM images WHERE user_id = ? AND status = "success"',
            (user_info['user_id'],)
        ).fetchone()['count']
        
        conn.close()
        
        success_rate = round((successful / total * 100) if total > 0 else 0, 2)
        
        return jsonify({
            'total_submissions': total,
            'successful_hunts': successful,
            'success_rate': success_rate
        }), 200
        
    except Exception as e:
        print(f"Get user stats error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """Get leaderboard with user rankings based on successful hunts"""
    try:
        conn = get_db_connection()
        
        # Get users with their win counts (successful hunts)
        leaderboard = conn.execute('''
            SELECT
                u.id,
                u.display_name,
                u.email,
                u.is_guest,
                COUNT(CASE WHEN i.status = 'success' THEN 1 END) as wins
            FROM users u
            LEFT JOIN images i ON u.id = i.user_id
            GROUP BY u.id, u.display_name, u.email, u.is_guest
            ORDER BY wins DESC, u.created_at ASC
        ''').fetchall()
        
        conn.close()
        
        # Format leaderboard data
        leaderboard_data = []
        for rank, user in enumerate(leaderboard, 1):
            leaderboard_data.append({
                'id': user['id'],
                'displayName': user['display_name'],
                'wins': user['wins'],
                'rank': rank,
                'isGuest': bool(user['is_guest'])
            })
        
        return jsonify({
            'leaderboard': leaderboard_data
        }), 200
        
    except Exception as e:
        print(f"Get leaderboard error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/admin/reset-wins/<int:user_id>', methods=['POST'])
def reset_user_wins(user_id):
    """Reset wins for a specific user (admin endpoint)"""
    try:
        conn = get_db_connection()
        
        # Delete all successful images for the user
        result = conn.execute(
            'DELETE FROM images WHERE user_id = ? AND status = "success"',
            (user_id,)
        )
        
        deleted_count = result.rowcount
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': f'Reset {deleted_count} wins for user {user_id}'
        }), 200
        
    except Exception as e:
        print(f"Reset wins error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/admin/update-display-name', methods=['POST'])
def update_display_name():
    """Update display name for a user (admin endpoint)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        display_name = data.get('displayName', '').strip()
        
        if not email or not display_name:
            return jsonify({'error': 'Email and display name are required'}), 400
        
        conn = get_db_connection()
        
        # Update user display name
        result = conn.execute(
            'UPDATE users SET display_name = ? WHERE email = ?',
            (display_name, email)
        )
        
        if result.rowcount == 0:
            conn.close()
            return jsonify({'error': 'User not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': f'Updated display name for {email} to {display_name}'
        }), 200
        
    except Exception as e:
        print(f"Update display name error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("=" * 50)
    print("Starting TouchGrass API Server")
    print("=" * 50)
    
    # Initialize database on startup
    init_database()
    
    # Clean up expired sessions on startup
    cleanup_expired_sessions()
    
    # Get port from environment or default to 5000
    port = int(os.getenv('PORT', 5000))
    
    print(f"\nServer starting on http://0.0.0.0:{port}")
    print(f"Database: {DATABASE}")
    print(f"Allowed origins: {allowed_origins}")
    print(f"Rate limiting: {'enabled' if LIMITER_AVAILABLE else 'disabled'}")
    print(f"Debug mode: {DEBUG_MODE}")
    print("\nPress CTRL+C to quit\n")
    print("=" * 50)
    
    # Run the Flask app
    # Note: In production, use a proper WSGI server like Gunicorn
    app.run(
        debug=DEBUG_MODE,
        host='0.0.0.0',
        port=port
    )