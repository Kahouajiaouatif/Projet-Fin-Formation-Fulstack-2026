import { apiFetch } from './api'

export async function login({ email, password }) {
  // TODO: connecter à POST /api/auth/login
  // const data = await apiFetch('/api/auth/login', {
  //   method: 'POST',
  //   body: JSON.stringify({ email, password }),
  // })
  // localStorage.setItem('token', data.token)
  // return data.user

  return { email, username: email.split('@')[0] }
}

export async function register({ username, email, password }) {
  // TODO: connecter à POST /api/auth/register
  // const data = await apiFetch('/api/auth/register', {
  //   method: 'POST',
  //   body: JSON.stringify({ username, email, password }),
  // })
  // localStorage.setItem('token', data.token)
  // return data.user

  return { email, username }
}

export function logout() {
  localStorage.removeItem('token')
}
