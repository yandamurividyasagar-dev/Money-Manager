import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Eye, EyeOff} from 'lucide-react'
import {login} from '../utils/auth'
import authBg from '../assets/auth-bg.jpg'
import './auth.css'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({email: '', password: ''})
  const [errors, setErrors] = useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!emailRegex.test(form.email))
      e.email = 'Enter a valid email address'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const onChange = ev => {
    setForm({...form, [ev.target.name]: ev.target.value})
    setErrors({...errors, [ev.target.name]: undefined})
    setSubmitError('')
  }

  const onSubmit = async ev => {
    ev.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return
    setLoading(true)
    try {
      await login(form)
      navigate('/', {replace: true})
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg" style={{'--auth-bg-image': `url(${authBg})`}}>
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-logo">$</div>
          <h1 className="auth-brand-name">Money Manager</h1>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">
          Sign in to continue tracking your finances securely.
        </p>

        {submitError && <div className="auth-banner">{submitError}</div>}

        <form onSubmit={onSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              Email address
            </label>
            <div className="auth-input-wrap">
              <input
                id="email"
                name="email"
                type="email"
                className={`auth-input ${errors.email ? 'has-error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="auth-error">{errors.email}</p>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <div className="auth-input-wrap">
              <input
                id="password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                className={`auth-input ${errors.password ? 'has-error' : ''}`}
                placeholder="Enter your password"
                value={form.password}
                onChange={onChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-pwd-toggle"
                onClick={() => setShowPwd(s => !s)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="auth-error">{errors.password}</p>}
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
