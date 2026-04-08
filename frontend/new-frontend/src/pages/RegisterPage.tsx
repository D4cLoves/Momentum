import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/authApi'

export function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await registerUser({ name, email, password })
      setSuccess('Регистрация успешна. Переходим на страницу входа...')
      setTimeout(() => {
        navigate('/login')
      }, 900)
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : 'Register failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="stack">
      <h1>Регистрация</h1>
      <form className="form stack" onSubmit={handleSubmit}>
        <label className="field">
          <span>Имя</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Пароль</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </section>
  )
}
