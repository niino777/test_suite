// Convierte una contraseña en un código SHA-256 para no guardarla como texto plano
export async function hashText (text) {
  const data = new TextEncoder().encode(text)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}
