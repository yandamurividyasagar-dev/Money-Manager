// Simple client-side auth using localStorage. Passwords are hashed (SHA-256)
// before storage. This is a demo-grade auth layer for the Money Manager app.

const USERS_KEY = 'mm_users'
const SESSION_KEY = 'mm_session'

const hash = async text => {
  const buf = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

const readUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

const writeUsers = users =>
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

export const signup = async ({name, email, password}) => {
  const users = readUsers()
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (exists) throw new Error('An account with this email already exists.')
  const passwordHash = await hash(password)
  const user = {
    id: Date.now().toString(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  writeUsers(users)
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({id: user.id, name: user.name, email: user.email}),
  )
  return user
}

export const login = async ({email, password}) => {
  const users = readUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) throw new Error('No account found with this email.')
  const passwordHash = await hash(password)
  if (passwordHash !== user.passwordHash)
    throw new Error('Incorrect password. Please try again.')
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({id: user.id, name: user.name, email: user.email}),
  )
  return user
}

export const logout = () => localStorage.removeItem(SESSION_KEY)

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}
