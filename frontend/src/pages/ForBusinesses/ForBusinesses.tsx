import { Link } from 'react-router-dom'
import './ForBusinesses.css'

interface ForBusinessesProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
  openModal: (title: string, body: string) => void
}

const ForBusinesses = ({ showNotification, openModal }: ForBusinessesProps) => {
  const features = [
    { icon: 'bi-shop', text: 'Free online store in minutes', color: 'primary' },
    { icon: 'bi-archive', text: 'Simple inventory management', color: 'success' },
    { icon: 'bi-graph-up', text: 'Track sales & best-sellers', color: 'info' },
    { icon: 'bi-chat-dots', text: 'Accept orders via SMS', color: 'warning' },
    { icon: 'bi-people', text: 'Connect with local customers', color: 'danger' },
    { icon: 'bi-lightbulb', text: 'Get business insights', color: 'secondary' }
  ]

  const stats = [
    { number: '500+', label: 'Active Businesses' },
    { number: '10k+', label: 'Monthly Orders' },
    { number: 'R2M+', label: 'Revenue Generated' },
  ]

  return (
    <div className="business-page">
      {/* Hero Section */}
      <section className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold text-primary mb-3">
              Grow Your Township Business
            </h1>
            <p className="lead text-secondary mb-4">
              TownTrade helps you overcome the challenges of going digital, even with limited resources. Join hundreds of local businesses already growing with us.
            </p>
            <div className="d-flex gap-3">
              <Link to="/get-started" className="btn btn-primary btn-lg">
                <i className="bi bi-rocket me-2"></i>
                Start Selling
              </Link>
              <button 
                className="btn btn-outline-primary btn-lg"
                onClick={() => openModal('Business Features', 
                  '<h6 class="fw-bold mb-3">Complete Business Toolkit:</h6>' +
                  '<ul class="list-unstyled">' +
                  '<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Digital storefront</li>' +
                  '<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Inventory management</li>' +
                  '<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Sales analytics</li>' +
                  '<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>SMS order system</li>' +
                  '<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Customer database</li>' +
                  '<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Payment integration</li>' +
                  '</ul>'
                )}
              >
                View all features
              </button>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="success-story">
              <i className="bi bi-quote display-1 opacity-50"></i>
              <p className="fs-4 fw-light mb-4">
                "I used to only sell to neighbours. Now customers from the next township order from me every week!"
              </p>
              <div className="d-flex align-items-center">
                <div className="bg-white bg-opacity-25 rounded-circle p-3 me-3">
                  <i className="bi bi-person-circle fs-3"></i>
                </div>
                <div>
                  <p className="fw-bold mb-0">Thabo's Spaza</p>
                  <small className="opacity-75">East London</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-4">
        <div className="row g-4">
          {stats.map((stat, index) => (
            <div className="col-md-4" key={index}>
              <div className="stats-card">
                <div className="stats-number">{stat.number}</div>
                <p className="text-secondary mb-0">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-4">
        <h2 className="text-center fs-1 fw-bold text-primary mb-5">Everything You Need to Succeed</h2>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="feature-card d-flex">
                <div className={`feature-icon bg-${feature.color} bg-opacity-10 me-3`}>
                  <i className={`bi ${feature.icon} text-${feature.color} fs-2`}></i>
                </div>
                <div>
                  <p className="fw-bold mb-1">{feature.text}</p>
                  <small className="text-secondary">Learn more <i className="bi bi-arrow-right"></i></small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="fw-bold text-primary mb-3">Ready to Take Your Business Online?</h2>
            <p className="text-secondary mb-4">Join TownTrade today and start reaching more customers in your community.</p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/get-started" className="btn btn-primary btn-lg px-5">
                Get Started Now
              </Link>
              <button 
                className="btn btn-outline-primary btn-lg px-5"
                onClick={() => showNotification('A representative will contact you soon!', 'success')}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ForBusinesses
