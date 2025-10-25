# TouchGrass - Nature Scavenger Hunt

TouchGrass is an interactive nature scavenger hunt application built with Next.js, React, and TypeScript. The app encourages users to get outside and reconnect with nature by completing photo-based challenges.

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Python Flask API for image recognition
- **Database**: SQLite (via backend)
- **UI**: React with Tailwind CSS styling

## Project Structure

```
touchgrass/
├── src/
│   ├── app/              # Next.js app directory (routes)
│   │   ├── [lang]/       # Multi-language routes
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Root page (redirects to /en)
│   ├── components/       # React components
│   │   ├── Camera.tsx    # Camera component for photo capture
│   │   └── Navbar.tsx    # Navigation component
│   └── lib/              # Utility libraries
│       ├── api.ts        # API communication functions
│       ├── i18n.ts       # Internationalization
│       └── userDatabase.ts # User data management
├── backend/              # Python Flask backend
│   ├── app.py           # Main Flask application
│   ├── requirements.txt # Python dependencies
│   └── touchgrass.db    # SQLite database
└── public/              # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Python 3.8+ (for backend)

### Installation

1. **Install frontend dependencies:**
   ```bash
   cd touchgrass
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd touchgrass/backend
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd touchgrass/backend
   python app.py
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server:**
   ```bash
   cd touchgrass
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

In the touchgrass directory:

### `npm run dev`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

The page will auto-reload when you make changes.

### `npm run build`

Builds the app for production to the `.next` folder.

### `npm start`

Runs the built app in production mode.

### `npm run lint`

Runs the Next.js linter to check for code quality issues.

## Features

- 📸 Camera integration for photo capture
- 🌍 Multi-language support (i18n)
- 🔐 User authentication (login/signup)
- 🎯 Scavenger hunt challenges
- 🖼️ AI-powered image recognition
- 📱 Responsive design

## Backend API

The Python backend provides image analysis capabilities:

- `POST /analyze` - Analyzes uploaded images for scavenger hunt challenges
- Uses computer vision to verify if captured photos match the challenge requirements

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Contributing

This is a student project. Feel free to fork and experiment!
