import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          <span className="navbar-logo">♻️</span>
          <span className="navbar-title">Zero-Waste <span className="accent">Vision</span></span>
        </a>
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            📷 Image Upload
          </NavLink>
          <NavLink to="/camera" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
            🎥 Live Camera
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
