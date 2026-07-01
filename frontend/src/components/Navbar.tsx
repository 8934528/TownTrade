import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import logo from '../assets/logo.png'

interface NavbarProps {
  openModal: (title: string, body: string) => void
}

const Navbar = ({ openModal }: NavbarProps) => {
  const location = useLocation()
  const activeTab = location.pathname
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { path: '/', icon: 'bi-house', label: 'Home' },
    { path: '/for-businesses', icon: 'bi-briefcase', label: 'Business' },
    { path: '/for-customers', icon: 'bi-people', label: 'Customers' },
    { path: '/get-started', icon: 'bi-rocket', label: 'Start' }
  ]

  return (
    <>
      {/* Fixed Navbar */}
      <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={logo} alt="TownTrade" height="48" className="d-inline-block align-top me-2" />
            <span className="fw-bold text-primary" style={{ fontSize: '1.25rem' }}>TownTrade</span>
          </Link>
          
          <div className="d-flex align-items-center">
            <Link to="/login" className="btn btn-outline-primary me-2">
              <i className="bi bi-box-arrow-in-right me-1"></i>
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              <i className="bi bi-person-plus me-1"></i>
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Desktop Secondary Nav */}
      <div className="bg-transparent border-bottom d-none d-lg-block" style={{ marginTop: '72px' }}>
        <div className="container">
          <ul className="nav nav-pills py-2">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <Link 
                  className={`nav-link ${activeTab === item.path ? 'active' : ''}`} 
                  to={item.path}
                >
                  <i className={`bi ${item.icon} me-1`}></i>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Bottom Tabs */}
      <nav className="d-lg-none fixed-bottom bg-card border-top" style={{ backdropFilter: 'blur(10px)' }}>
        <div className="d-flex justify-content-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-center text-decoration-none px-3 py-2 rounded ${activeTab === item.path ? 'text-primary bg-primary bg-opacity-10' : 'text-secondary'}`}
            >
              <i className={`bi ${item.icon} fs-5 d-block`}></i>
              <span className="small" style={{ fontSize: '0.7rem' }}>{item.label}</span>
            </Link>
          ))}
          <button 
            className="btn text-center text-decoration-none bg-transparent border-0 p-0 px-3 py-2"
            onClick={() => openModal('Quick Actions', 
              '<div class="list-group list-group-flush bg-transparent"><button class="list-group-item list-group-item-action bg-transparent">View Cart</button><button class="list-group-item list-group-item-action bg-transparent">Saved Items</button><button class="list-group-item list-group-item-action bg-transparent">Settings</button></div>'
            )}
          >
            <i className="bi bi-grid fs-5 d-block text-secondary"></i>
            <span className="small" style={{ fontSize: '0.7rem' }}>More</span>
          </button>
        </div>
      </nav>
    </>
  )
}

export default Navbar
