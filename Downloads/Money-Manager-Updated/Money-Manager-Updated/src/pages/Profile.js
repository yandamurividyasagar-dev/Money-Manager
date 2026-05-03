import {useState} from 'react'
import {getSession} from '../utils/auth'
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Edit3,
  Save,
  X,
} from 'lucide-react'
import './Profile.css'

const Profile = ({onClose}) => {
  const session = getSession()
  const saved = JSON.parse(localStorage.getItem('mm_profile') || '{}')

  const initials = name =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0].toUpperCase())
      .join('')

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: saved.name || session?.name || '',
    email: saved.email || session?.email || '',
    phone: saved.phone || '',
    dob: saved.dob || '',
    gender: saved.gender || '',
    city: saved.city || '',
    occupation: saved.occupation || '',
    monthlyIncome: saved.monthlyIncome || '',
  })

  const onChange = e => setForm({...form, [e.target.name]: e.target.value})

  const onSave = e => {
    e.preventDefault()
    localStorage.setItem('mm_profile', JSON.stringify(form))
    setEditing(false)
  }

  const filled = Object.values(form).filter(v => String(v).trim() !== '').length
  const percent = Math.round((filled / Object.keys(form).length) * 100)

  const details = [
    {icon: <User size={16} />, label: 'Full Name', value: form.name},
    {icon: <Mail size={16} />, label: 'Email', value: form.email},
    {
      icon: <Phone size={16} />,
      label: 'Phone',
      value: form.phone || 'Not provided',
    },
    {
      icon: <Calendar size={16} />,
      label: 'Date of Birth',
      value: form.dob || 'Not provided',
    },
    {
      icon: <User size={16} />,
      label: 'Gender',
      value: form.gender || 'Not provided',
    },
    {
      icon: <MapPin size={16} />,
      label: 'City',
      value: form.city || 'Not provided',
    },
    {
      icon: <Briefcase size={16} />,
      label: 'Occupation',
      value: form.occupation || 'Not provided',
    },
    {
      icon: <DollarSign size={16} />,
      label: 'Monthly Income',
      value: form.monthlyIncome ? `Rs ${form.monthlyIncome}` : 'Not provided',
    },
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card profile-modal"
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={16} />
        </button>

        {/* Top avatar section */}
        <div className="profile-top">
          <div className="profile-avatar">{initials(form.name || 'U')}</div>
          <div>
            <h2 className="profile-name">{form.name}</h2>
            <p className="profile-email">{form.email}</p>
            <span
              style={{
                fontSize: 12,
                background: '#f0fdf4',
                color: '#22c55e',
                padding: '2px 10px',
                borderRadius: 999,
                fontWeight: 600,
              }}
            >
              {form.occupation || 'Member'}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="profile-progress-bar-wrap">
          <div className="profile-progress-label">
            <span>Profile Completion</span>
            <span
              style={{
                fontWeight: 700,
                color: percent === 100 ? '#22c55e' : '#2563eb',
              }}
            >
              {percent}%
            </span>
          </div>
          <div className="profile-progress-track">
            <div
              className="profile-progress-fill"
              style={{
                width: `${percent}%`,
                background: percent === 100 ? '#22c55e' : '#2563eb',
              }}
            />
          </div>
          <p className="profile-progress-hint">
            {percent === 100
              ? '🎉 Profile 100% complete!'
              : 'Click Edit to complete your profile ✨'}
          </p>
        </div>

        {/* VIEW MODE */}
        {!editing && (
          <>
            <div className="profile-details-grid">
              {details.map((d, i) => (
                <div key={i} className="profile-detail-item">
                  <div className="profile-detail-icon">{d.icon}</div>
                  <div>
                    <p className="profile-detail-label">{d.label}</p>
                    <p
                      className="profile-detail-value"
                      style={{
                        color:
                          d.value === 'Not provided' ? '#94a3b8' : '#0f172a',
                      }}
                    >
                      {d.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="settings-save"
              style={{marginTop: 20}}
              onClick={() => setEditing(true)}
            >
              <Edit3
                size={16}
                style={{marginRight: 8, verticalAlign: 'middle'}}
              />
              Edit Profile
            </button>
          </>
        )}

        {/* EDIT MODE */}
        {editing && (
          <form onSubmit={onSave} className="profile-form">
            <div className="profile-form-grid">
              <div className="profile-field">
                <label>Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your full name"
                />
              </div>
              <div className="profile-field">
                <label>Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="your@email.com"
                  type="email"
                />
              </div>
              <div className="profile-field">
                <label>Phone Number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="profile-field">
                <label>Date of Birth</label>
                <input
                  name="dob"
                  value={form.dob}
                  onChange={onChange}
                  type="date"
                />
              </div>
              <div className="profile-field">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={onChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="profile-field">
                <label>City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={onChange}
                  placeholder="e.g. Hyderabad"
                />
              </div>
              <div className="profile-field">
                <label>Occupation</label>
                <input
                  name="occupation"
                  value={form.occupation}
                  onChange={onChange}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div className="profile-field">
                <label>Monthly Income (Rs)</label>
                <input
                  name="monthlyIncome"
                  value={form.monthlyIncome}
                  onChange={onChange}
                  placeholder="e.g. 50000"
                  type="number"
                />
              </div>
            </div>
            <div style={{display: 'flex', gap: 12, marginTop: 20}}>
              <button type="submit" className="settings-save" style={{flex: 1}}>
                <Save
                  size={16}
                  style={{marginRight: 8, verticalAlign: 'middle'}}
                />
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Profile
