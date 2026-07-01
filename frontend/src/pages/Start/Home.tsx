import { Link } from 'react-router-dom'
import './Home.css'

interface HomeProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void
  openModal: (title: string, body: string) => void
}

const Home = ({ showNotification, openModal }: HomeProps) => {
  const features = [
    { icon: 'bi-shop', title: 'Free Online Shop', desc: 'Get your own digital storefront in minutes' },
    { icon: 'bi-archive', title: 'Inventory Tracking', desc: 'Know what\'s in stock and what\'s selling' },
    { icon: 'bi-wifi-off', title: 'Works Offline', desc: 'Use SMS to take orders and update inventory' },
    { icon: 'bi-people', title: 'Community Focused', desc: 'Connect with customers in your area' },
    { icon: 'bi-graph-up', title: 'Sales Analytics', desc: 'Track your business growth' },
    { icon: 'bi-credit-card', title: 'Easy Payments', desc: 'Accept various payment methods' }
  ]

  const steps = [
    { number: 1, title: 'Sign Up', desc: 'Create your free account' },
    { number: 2, title: 'Set Up Shop', desc: 'Add your products and details' },
    { number: 3, title: 'Start Selling', desc: 'Receive orders from customers' },
    { number: 4, title: 'Get Paid', desc: 'Receive payments easily' }
  ]

  const stats = [
    { number: '500+', label: 'Active Businesses' },
    { number: '10k+', label: 'Happy Customers' },
    { number: '50k+', label: 'Orders Completed' }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-3 mb-lg-0">
              <h1 className="display-3 fw-bold text-primary mb-2">
                Grow Your Township Business Digitally
              </h1>
              <p className="lead text-secondary mb-2">
                TownTrade gives small businesses an online shop, inventory management, and offline support - even without internet.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-2">
                <Link to="/get-started" className="btn btn-primary btn-lg px-4">
                  <i className="bi bi-rocket me-2"></i>
                  Start Selling
                </Link>
                <button 
                  className="btn btn-outline-primary btn-lg px-4"
                  onClick={() => showNotification('Welcome to TownTrade!', 'success')}
                >
                  <i className="bi bi-shop me-2"></i>
                  Start Shopping
                </button>
              </div>
              <div className="d-flex gap-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <span className="small">Free to join</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <span className="small">No monthly fees</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <span className="small">Works offline</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image-wrapper">
                <i className="bi bi-phone display-1 text-primary d-block text-center"></i>
                <div className="row g-2 mt-2">
                  <div className="col-4">
                    <div className="bg-white p-2 rounded text-center">
                      <i className="bi bi-shop text-primary"></i>
                      <small className="d-block">Shops</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-white p-2 rounded text-center">
                      <i className="bi bi-truck text-success"></i>
                      <small className="d-block">Delivery</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="bg-white p-2 rounded text-center">
                      <i className="bi bi-credit-card text-warning"></i>
                      <small className="d-block">Payment</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-3">
        <div className="row g-4">
          {stats.map((stat, index) => (
            <div className="col-md-4" key={index}>
              <div className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="progress mt-3" style={{ height: '4px' }}>
                  <div className="progress-bar bg-primary" style={{ width: `${(index + 1) * 30}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-3">
        <h2 className="text-center display-5 fw-bold text-primary mb-5">
          Why Choose TownTrade?
        </h2>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                <h4 className="fw-bold mb-2">{feature.title}</h4>
                <p className="text-secondary mb-3">{feature.desc}</p>
                <button 
                  className="btn btn-link text-primary p-0"
                  onClick={() => openModal(feature.title, 
                    `<p>${feature.desc}</p>
                    <p class="text-secondary">Start using this feature today and grow your business.</p>
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
      <section className="container py-3">
        <h2 className="text-center display-5 fw-bold text-primary mb-5">
          How TownTrade Works
        </h2>
        <div className="row g-4">
          {steps.map((step) => (
            <div className="col-md-3" key={step.number}>
              <div className="step-card">
                <div className="step-number">{step.number}</div>
                <h5 className="fw-bold mb-2">{step.title}</h5>
                <p className="text-secondary small mb-0">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-3">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="bg-white bg-opacity-75 p-5 rounded-4">
              <i className="bi bi-quote display-1 text-primary opacity-25"></i>
              <p className="fs-3 fw-light mb-4">
                "TownTrade transformed my small spaza shop. I now reach customers I never thought possible, and the SMS ordering system is a game-changer for my elderly customers."
              </p>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="bi bi-person-circle text-primary fs-3"></i>
                </div>
                <div>
                  <p className="fw-bold mb-0">Grace Ndlovu</p>
                  <small className="text-secondary">Owner, Mama Grace's Bakery</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-3">
        <div className="cta-section">
          <h2 className="display-5 fw-bold mb-3">Ready to Transform Your Business?</h2>
          <p className="fs-5 mb-4 opacity-90">Join hundreds of township businesses already growing with TownTrade</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/get-started" className="btn btn-light btn-lg px-5">
              Get Started Today
            </Link>
            <button 
              className="btn btn-outline-light btn-lg px-5"
              onClick={() => openModal('Contact Us', 
                '<div class="text-center mb-3"><i class="bi bi-envelope display-1 text-primary"></i></div>' +
                '<p class="text-center">Have questions? We\'re here to help!</p>' +
                '<form><div class="mb-3"><input type="email" class="form-control" placeholder="Your email"></div>' +
                '<div class="mb-3"><textarea class="form-control" rows="3" placeholder="Your message"></textarea></div>' +
                '<button class="btn btn-primary w-100">Send Message</button></form>'
              )}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
