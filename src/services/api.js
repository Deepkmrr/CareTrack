const API = 'http://localhost:3001/api'

export async function request(path, options) {
  const response = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })

  if (!response.ok) {
    throw new Error((await response.json()).error || 'Something went wrong')
  }

  return response.status === 204 ? null : response.json()
}
