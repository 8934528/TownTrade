import { Link } from 'react-router-dom'
import './ForCustomers.css'

interface ForCustomersProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
  openModal: (title: string, body: string) => void
}

const ForCustomers = ({ showNotification, openModal }: ForCustomersProps) => {
  const features = [
    { 
      icon: 'bi-phone', 
      title: 'Browse on the app', 
      desc: 'Discover local businesses and their products easily',
      color: 'primary'
    },
    { 
      icon: 'bi-chat-dots', 
      title: 'Order via SMS', 
      desc: 'No internet? No problem! Order using simple SMS',
      color: 'success'
    },
    { 
      icon: 'bi-cash-coin', 
      title: 'Pay your way', 
      desc: 'Cash, mobile money, or card - you choose',
      color: 'warning'
    },
    { 
      icon: 'bi-truck', 
      title: 'Delivery or pickup', 
      desc: 'Free local delivery or collect in-store',
      color: 'info'
    }
  ]

  const benefits = [
    'Support local businesses',
    'No delivery fees within 2km',
    'Earn loyalty points',
    'Real-time order tracking',
    'Secure payments',
    '24/7 customer support'
  ]

  const steps = [
    { number: 1, title: 'Sign Up', desc: 'Create your free account in minutes' },
    { number: 2, title: 'Find Shops', desc: 'Discover local businesses near you' },
    { number: 3, title: 'Order', desc: 'Order online or via SMS' },
    { number: 4, title: 'Enjoy', desc: 'Get delivery or pickup your items' }
  ]

  return (
    <div className="customer-page">
      {/* Hero Section */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h1 className="display-4 fw-bold text-primary mb-3">
              Shop Local, Support Your Community
            </h1>
            <p className="lead text-secondary mb-4">
              Discover and support local businesses in your township – easily, whether you're online or offline.
            </p>
            <div className="d-flex flex-wrap gap-3 mb-4">
              <Link to="/get-started" className="btn btn-primary btn-lg">
                <i className="bi bi-person-plus me-2"></i>
                Sign Up as Customer
              </Link>
              <button 
                className="btn btn-outline-primary btn-lg"
                onClick={() => showNotification('Finding shops near you... 📍', 'success')}
              >
                <i className="bi bi-geo-alt me-2"></i>
                Find Shops Near Me
              </button>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {benefits.slice(0, 3).map((benefit, index) => (
                <span key={index} className="benefit-badge">
                  <i className="bi bi-check-circle-fill text-success me-1"></i>
                  {benefit}
                </span>
              ))}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="bg-primary bg-opacity-10 p-5 rounded-4 text-center">
              <i className="bi bi-phone display-1 text-primary"></i>
              <h4 className="mt-3 fw-bold">Shop Anywhere, Anytime</h4>
              <p className="text-secondary">Even without data, you can order via SMS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-4">
        <h2 className="text-center fs-1 fw-bold text-primary mb-5">How You Can Shop</h2>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-md-6" key={index}>
              <div className="feature-card">
                <div className={`feature-icon-wrapper bg-${feature.color} bg-opacity-10`}>
                  <i className={`bi ${feature.icon} text-${feature.color} fs-1`}></i>
                </div>
                <h4 className="fw-bold mb-2">{feature.title}</h4>
                <p className="text-secondary mb-3">{feature.desc}</p>
                <button 
                  className="btn btn-link text-primary p-0"
                  onClick={() => openModal(feature.title, 
                    `<p>${feature.desc}</p>
                    <p class="text-secondary">Start shopping today and support local businesses in your community.</p>
                    <button class="btn btn-primary w-100 mt-3">Learn More</button>`
                  )}
                >
                  Learn more <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-5">
        <h2 className="text-center fs-1 fw-bold text-primary mb-5">How It Works</h2>
        <div className="row g-4">
          {steps.map((step) => (
            <div className="col-md-3" key={step.number}>
              <div className="how-it-works-step">
                <div className="step-number">{step.number}</div>
                <h5 className="fw-bold mb-2">{step.title}</h5>
                <p className="text-secondary small mb-0">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-4">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="testimonial-card p-4">
              <i className="bi bi-quote display-1 text-primary opacity-25"></i>
              <p className="fs-4 fw-light mb-4">
                "I love being able to support local businesses in my area. The SMS ordering feature is a lifesaver when I don't have data!"
              </p>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-person-circle text-primary fs-3"></i>
                </div>
                <div>
                  <p className="fw-bold mb-0">Thando M.</p>
                  <small className="text-secondary">Customer since 2025</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-5">
        <div className="bg-primary text-white p-5 rounded-4 text-center">
          <h2 className="fw-bold mb-3">Start Shopping Locally Today</h2>
          <p className="mb-4 opacity-75">Join thousands of customers supporting township businesses</p>
          <Link to="/get-started" className="btn btn-light btn-lg px-5">
            Get Started <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ForCustomers
