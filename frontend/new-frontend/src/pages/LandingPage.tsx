import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <section className="stack">
      <h1>Momentum</h1>
      <p>Простой стартовый лендинг. Выбери действие:</p>
      <div>
        <Link to="/login">Вход</Link> | <Link to="/register">Регистрация</Link>
      </div>
    </section>
  )
}
