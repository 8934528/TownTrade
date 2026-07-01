import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-card border-top py-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h6 className="fw-bold text-primary mb-3">TownTrade</h6>
            <p className="small text-secondary">Empowering township businesses through digital tools and community connection.</p>
            <div className="d-flex gap-2">
            </div>
          </div>
          <div className="col-md-2">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
              <li className="mb-2"><Link to="/for-businesses" className="text-secondary text-decoration-none">For Businesses</Link></li>
              <li className="mb-2"><Link to="/for-customers" className="text-secondary text-decoration-none">For Customers</Link></li>
              <li className="mb-2"><Link to="/get-started" className="text-secondary text-decoration-none">Get Started</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#" className="text-secondary text-decoration-none">Help Center</a></li>
              <li className="mb-2"><a href="#" className="text-secondary text-decoration-none">FAQs</a></li>
              <li className="mb-2"><a href="#" className="text-secondary text-decoration-none">Contact Us</a></li>
              <li className="mb-2"><a href="#" className="text-secondary text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold mb-3">Contact</h6>
            <p className="small text-secondary mb-2"><i className="bi bi-envelope me-2"></i>hello@towntrade.co.za</p>
            <p className="small text-secondary mb-2"><i className="bi bi-telephone me-2"></i>+27 (0) 123 456 789</p>
            <p className="small text-secondary"><i className="bi bi-geo-alt me-2"></i>East London, South Africa</p>
          </div>
        </div>
        <hr className="my-4 bg-secondary bg-opacity-25" />
        <div className="text-center small text-secondary">
          &copy; {new Date().getFullYear()} TownTrade. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
