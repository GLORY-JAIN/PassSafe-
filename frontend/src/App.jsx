import { useState } from 'react'
import './App.css'

function App() {
  // State for form inputs
  const [label, setLabel] = useState('')
  const [password, setPassword] = useState('')
  // State for password strength (placeholder for now)
  const [strength, setStrength] = useState('')
  // State for saved passwords (mock data for now)
  const [passwords, setPasswords] = useState([
    { label: 'Email', password: '••••••••', strength: 'Strong' },
    { label: 'Bank', password: '••••••••', strength: 'Medium' },
  ])

  // Handle form submission (mock)
  const handleSubmit = (e) => {
    e.preventDefault()
    // Add new password to list (mock, no API yet)
    setPasswords([
      ...passwords,
      { label, password: '••••••••', strength: 'Weak' },
    ])
    setLabel('')
    setPassword('')
    setStrength('')
  }

  // Handle password input change (placeholder for strength)
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    // Placeholder: set strength to Medium for demo
    setStrength('Medium')
  }

  return (
    <div className="container">
      <h1>PassSafe</h1>
      <form className="password-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Label (e.g. Email, Bank)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <div className={`strength strength-${strength.toLowerCase()}`}>{strength && `Strength: ${strength}`}</div>
        <button type="submit">Save Password</button>
      </form>
      <div className="password-list">
        <h2>Saved Passwords</h2>
        <ul>
          {passwords.map((item, idx) => (
            <li key={idx} className={`strength-${item.strength.toLowerCase()}`}>
              <span className="label">{item.label}</span>
              <span className="dots">{item.password}</span>
              <span className="strength">{item.strength}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
