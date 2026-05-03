import './index.css'

const RoleToggle = ({role, setRole}) => {
  return (
    <div className="role-toggle">
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="ADMIN">Admin</option>
        <option value="VIEWER">Viewer</option>
      </select>
    </div>
  )
}

export default RoleToggle
