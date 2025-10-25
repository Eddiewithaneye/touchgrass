// Simple user database simulation using localStorage
export interface User {
  email: string
  password: string
  createdAt: string
}

const USERS_KEY = 'touchgrass_users'

// Get all users from localStorage
export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return []
  
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

// Save users to localStorage
function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Check if email already exists
export function emailExists(email: string): boolean {
  const users = getAllUsers()
  return users.some(user => user.email.toLowerCase() === email.toLowerCase())
}

// Register a new user
export function registerUser(email: string, password: string): { success: boolean; message: string } {
  if (emailExists(email)) {
    return { success: false, message: 'Email already in use' }
  }

  const users = getAllUsers()
  const newUser: User = {
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  saveUsers(users)

  return { success: true, message: 'User registered successfully' }
}

// Validate user credentials
export function validateUser(email: string, password: string): boolean {
  const users = getAllUsers()
  return users.some(user => 
    user.email.toLowerCase() === email.toLowerCase() && 
    user.password === password
  )
}

// Initialize with default users if none exist
export function initializeDefaultUsers(): void {
  if (typeof window === 'undefined') return
  
  const users = getAllUsers()
  if (users.length === 0) {
    const defaultUsers: User[] = [
      { email: 'demo@touchgrass.com', password: 'password123', createdAt: new Date().toISOString() },
      { email: 'user@example.com', password: 'touchgrass', createdAt: new Date().toISOString() },
      { email: 'test@test.com', password: 'test123', createdAt: new Date().toISOString() }
    ]
    saveUsers(defaultUsers)
  }
}