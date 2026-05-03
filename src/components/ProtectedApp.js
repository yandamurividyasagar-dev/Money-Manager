import {useNavigate, Navigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import MoneyManager from './MoneyManager'
import Navbar from './Navbar'
import {getSession, logout} from '../utils/auth'
import bg from '../assets/finance-bg.jpg'
import dashboardBg from '../assets/dashboard-bg.png'

const ProtectedApp = () => {
  const navigate = useNavigate()
  const session = getSession()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const handler = e => {
      const {type, title, amount} = e.detail
      const msg =
        type === 'add'
          ? `Added: ${title} - Rs ${amount}`
          : `Updated: ${title} - Rs ${amount}`
      setNotifications(prev => [msg, ...prev])
    }
    window.addEventListener('mm-transaction', handler)
    return () => window.removeEventListener('mm-transaction', handler)
  }, [])

  if (!session) return <Navigate to="/login" replace />

  const onLogout = () => {
    logout()
    navigate('/login', {replace: true})
  }

  const onSearch = q => {
    window.dispatchEvent(new CustomEvent('mm-search', {detail: q}))
  }

  const onAddClick = () => {
    const el = document.querySelector('.add-transaction-form')
    if (el) el.scrollIntoView({behavior: 'smooth', block: 'center'})
  }

  return (
    <div className="mm-app-shell">
      <div className="mm-app-bg" style={{backgroundImage: `url(${bg})`}} />
      <Navbar
        user={session}
        onLogout={onLogout}
        onSearch={onSearch}
        onAddClick={onAddClick}
        notifications={notifications}
        onClearNotifications={() => setNotifications([])}
      />
      <div
        className="mm-dashboard-bg"
        style={{backgroundImage: `url(${dashboardBg})`}}
      >
        <MoneyManager userName={session.name} />
      </div>
    </div>
  )
}

export default ProtectedApp
