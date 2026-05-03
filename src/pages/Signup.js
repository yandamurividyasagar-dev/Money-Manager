import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Eye, EyeOff} from 'lucide-react'
import {signup} from '../utils/auth'
import authBg from '../assets/auth-bg.jpg'
import './auth.css'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Signup = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [errors, setErrors] = useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    else if (form.name.trim().length < 2) e.name = 'Name is too short'

    if (!form.email.trim()) e.email = 'Email is required'
    else if (!emailRegex.test(form.email))
      e.email = 'Enter a valid email address'

    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8)
      e.password = 'Password must be at least 8 characters'
    else if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password))
      e.password = 'Use at least one uppercase letter and one number'

    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.confirm !== form.password)
      e.confirm = 'Passwords do not match'

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
      await signup(form)
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
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">
          Start managing your income and expenses in seconds.
        </p>

        {submitError && <div className="auth-banner">{submitError}</div>}

        <form onSubmit={onSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`auth-input ${errors.name ? 'has-error' : ''}`}
              placeholder="e.g. Jane Doe"
              value={form.name}
              onChange={onChange}
              autoComplete="name"
            />
            {errors.name && <p className="auth-error">{errors.name}</p>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              Email address
            </label>
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
                className={`auth-input auth-input-pad ${
                  errors.password ? 'has-error' : ''
                }`}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                value={form.password}
                onChange={onChange}
                autoComplete="new-password"
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

          <div className="auth-field">
            <label className="auth-label" htmlFor="confirm">
              Confirm password
            </label>
            <div className="auth-input-wrap">
              <input
                id="confirm"
                name="confirm"
                type={showConfirm ? 'text' : 'password'}
                className={`auth-input auth-input-pad ${
                  errors.confirm ? 'has-error' : ''
                }`}
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={onChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-pwd-toggle"
                onClick={() => setShowConfirm(s => !s)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirm && <p className="auth-error">{errors.confirm}</p>}
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
