import {useLocation} from 'react-router-dom'
import {useEffect} from 'react'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname,
    )
  }, [location.pathname])

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f1f5f9',
      }}
    >
      <div style={{textAlign: 'center'}}>
        <h1 style={{fontSize: 48, fontWeight: 700, marginBottom: 16}}>404</h1>
        <p style={{fontSize: 20, color: '#64748b', marginBottom: 16}}>
          Oops! Page not found
        </p>
        <a href="/" style={{color: '#2563eb', textDecoration: 'underline'}}>
          Return to Home
        </a>
      </div>
    </div>
  )
}

export default NotFound
