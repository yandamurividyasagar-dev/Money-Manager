import {useState} from 'react'
import './Profile.css'

const Settings = ({onClose}) => {
  const [currency, setCurrency] = useState('Rs')
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <h2 className="settings-title">⚙️ Settings</h2>

        <div className="settings-group">
          <label className="settings-label">Currency</label>
          <select
            className="settings-select"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
          >
            <option value="Rs">₹ Indian Rupee (Rs)</option>
            <option value="$">$ US Dollar</option>
            <option value="€">€ Euro</option>
            <option value="£">£ British Pound</option>
          </select>
        </div>

        <div className="settings-group">
          <div className="settings-toggle-row">
            <div>
              <p className="settings-label">Dark Mode</p>
              <p className="settings-sub">Switch to dark theme</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={e => setDarkMode(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-toggle-row">
            <div>
              <p className="settings-label">Notifications</p>
              <p className="settings-sub">Get alerts on transactions</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={e => setNotifications(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <button className="settings-save" onClick={onClose}>
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default Settings
