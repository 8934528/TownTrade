import { Link } from 'react-router-dom'
import './GetStarted.css'

interface GetStartedProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
  openModal: (title: string, body: string) => void
}

const GetStarted = ({ showNotification, openModal }: GetStartedProps) => {
  const businessFeatures = [
    'Free online store',
    'Inventory management',
    'Sales analytics',
    'SMS order system',
    'Customer database',
    'Payment integration'
  ]

  const customerFeatures = [
    'Browse local shops',
    'Order via SMS',
    'Multiple payment options',
    'Free local delivery',
    'Loyalty points',
    'Order tracking'
  ]

  return (
    <div className="get-started-page">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">Join TownTrade Today</h1>
          <p className="fs-5 text-secondary">Choose the account type that fits you best</p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Business Option */}
          <div className="col-lg-5">
            <div className="option-card">
              <div className="option-icon">
                <i className="bi bi-briefcase"></i>
              </div>
              <h3 className="fw-bold mb-2">I Own a Business</h3>
              <p className="text-secondary mb-4">List your products, manage sales, and grow your customer base</p>
              
              <ul className="feature-list">
                {businessFeatures.map((feature, index) => (
                  <li key={index}>
                    <i className="bi bi-check-circle-fill"></i>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="d-grid gap-2 mt-4">
                <Link to="/signup?type=business" className="btn btn-primary btn-lg">
                  <i className="bi bi-briefcase me-2"></i>
                  Register as Business
                </Link>
                <button 
                  className="btn btn-link text-primary"
                  onClick={() => openModal('Business Features', 
                    '<h5 class="fw-bold mb-3">Complete Business Toolkit:</h5>' +
                    '<ul class="list-unstyled">' +
                    businessFeatures.map(f => `<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>${f}</li>`).join('') +
                    '</ul>' +
                    '<p class="mt-3">Start growing your business today with TownTrade.</p>'
                  )}
                >
                  Learn more about business features <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Customer Option */}
          <div className="col-lg-5">
            <div className="option-card">
              <div className="option-icon">
                <i className="bi bi-person"></i>
              </div>
              <h3 className="fw-bold mb-2">I Want to Shop</h3>
              <p className="text-secondary mb-4">Discover local businesses and order your essentials easily</p>
              
              <ul className="feature-list">
                {customerFeatures.map((feature, index) => (
                  <li key={index}>
                    <i className="bi bi-check-circle-fill"></i>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="d-grid gap-2 mt-4">
                <Link to="/signup?type=customer" className="btn btn-success btn-lg">
                  <i className="bi bi-person me-2"></i>
                  Sign Up as Customer
                </Link>
                <button 
                  className="btn btn-link text-primary"
                  onClick={() => showNotification('Start shopping and supporting local businesses!', 'success')}
                >
                  Learn more about shopping <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="bg-white bg-opacity-50 p-4 rounded-4 text-center">
              <p className="mb-0">
                <i className="bi bi-shield-check text-primary me-2"></i>
                Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Log in here</Link>
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="text-center">
              <small className="text-secondary">
                Have questions? <button className="btn btn-link text-primary p-0" onClick={() => openModal('FAQs',
                  '<div class="mb-3"><h6 class="fw-bold">Is it really free?</h6><p class="text-secondary">Yes! Basic features are completely free. Premium features available.</p></div>' +
                  '<div class="mb-3"><h6 class="fw-bold">How does SMS ordering work?</h6><p class="text-secondary">Customers can send an SMS to place orders, no internet required.</p></div>' +
                  '<div class="mb-3"><h6 class="fw-bold">What payment methods are supported?</h6><p class="text-secondary">Cash, mobile money, and card payments are all supported.</p></div>'
                )}>Check our FAQs</button>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GetStarted