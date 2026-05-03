import {useState, useEffect, useRef} from 'react'
import {
  Search,
  Bell,
  LayoutDashboard,
  Wallet,
  PieChart,
  Settings,
  LogOut,
  User,
  Menu,
  Plus,
  X,
} from 'lucide-react'
import './index.css'

const initials = name =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('')

const Navbar = ({
  user,
  notifications = [],
  onLogout,
  onSearch,
  onAddClick,
  onClearNotifications,
  onProfileClick,
  onSettingsClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const menuRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    const close = e => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const scrollTo = selector => {
    const el = document.querySelector(selector)
    if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'})
  }

  const handleProfile = () => {
    setMenuOpen(false)
    if (onProfileClick) onProfileClick()
  }
  const handleSettings = () => {
    setMenuOpen(false)
    if (onSettingsClick) onSettingsClick()
  }

  return (
    <nav className="mm-navbar">
      <div className="mm-navbar-inner">
        {/* Brand - always visible */}
        <div className="mm-nav-brand">
          <div className="mm-nav-logo">₹</div>
          <span>Money Manager</span>
        </div>

        {/* Search - desktop only */}
        <form
          className="mm-nav-search"
          onSubmit={e => {
            e.preventDefault()
            onSearch && onSearch(query)
          }}
        >
          <Search size={16} />
          <input
            type="text"
            placeholder="Search transactions, categories..."
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              onSearch && onSearch(e.target.value)
            }}
          />
        </form>

        {/* Nav links - desktop only */}
        <div
          className={`mm-nav-links ${mobileOpen ? 'mm-nav-mobile-open' : ''}`}
        >
          <button
            className="mm-nav-link"
            onClick={() => scrollTo('.header-container')}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button
            className="mm-nav-link"
            onClick={() => scrollTo('.transactions-container')}
          >
            <Wallet size={16} /> Transactions
          </button>
          <button
            className="mm-nav-link"
            onClick={() => scrollTo('.insights-container')}
          >
            <PieChart size={16} /> Insights
          </button>
        </div>

        {/* Spacer pushes right items to end on desktop */}
        <div style={{marginLeft: 'auto'}} />

        {/* Bell notification */}
        <div className="mm-nav-user" ref={notifRef}>
          <button
            className="mm-nav-icon-btn"
            onClick={() => setNotifOpen(o => !o)}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="mm-nav-badge">{notifications.length}</span>
            )}
          </button>
          {notifOpen && (
            <div className="mm-nav-menu" style={{minWidth: 280}}>
              <div
                className="mm-nav-menu-header"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{fontWeight: 700}}>Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: '16px',
                    color: '#94a3b8',
                    fontSize: 13,
                    textAlign: 'center',
                  }}
                >
                  No notifications yet
                </div>
              ) : (
                notifications.map((msg, i) => (
                  <div
                    key={i}
                    className="mm-nav-menu-item"
                    style={{fontSize: 13, color: '#334155'}}
                  >
                    🔔 {msg}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Avatar + dropdown */}
        <div className="mm-nav-user" ref={menuRef}>
          <button
            className="mm-nav-avatar"
            onClick={() => setMenuOpen(o => !o)}
          >
            {initials(user?.name || 'U')}
          </button>
          {menuOpen && (
            <div className="mm-nav-menu">
              <div className="mm-nav-menu-header">
                <div className="mm-nav-menu-name">{user?.name}</div>
                <div className="mm-nav-menu-email">{user?.email}</div>
              </div>
              <button className="mm-nav-menu-item" onClick={handleProfile}>
                <User size={16} /> Profile
              </button>
              <button className="mm-nav-menu-item" onClick={handleSettings}>
                <Settings size={16} /> Settings
              </button>
              <button className="mm-nav-menu-item danger" onClick={onLogout}>
                <LogOut size={16} /> Log out
              </button>
            </div>
          )}
        </div>

        {/* Add button */}
        <button className="mm-nav-link mm-nav-add-btn" onClick={onAddClick}>
          <Plus size={16} /> Add
        </button>

        {/* Hamburger - mobile only */}
        <button
          className="mm-nav-mobile-toggle"
          onClick={() => setMobileOpen(o => !o)}
        >
          <Menu size={22} />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
