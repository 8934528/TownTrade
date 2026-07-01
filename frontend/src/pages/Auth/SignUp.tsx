import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

interface SignUpProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const SignUp = ({ showNotification }: SignUpProps) => {
  const location = useLocation();
  const { register, isLoading } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const defaultType = queryParams.get('type') || 'customer';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: defaultType,
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        role: formData.accountType as 'customer' | 'business',
        phone: formData.phone || undefined
      });
      showNotification('Account created successfully! Please log in.', 'success');
    } catch (error) {
      const err = error as { message?: string };
      showNotification(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card">
              <div className="text-center mb-4">
                <h2 className="fs-2 fw-bold text-primary mb-1">Create Account</h2>
                <p className="text-secondary small">Join TownTrade today</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <i className="bi bi-person text-secondary"></i>
                    </span>
                    <input 
                      type="text" 
                      className="form-control border-start-0 ps-0"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <i className="bi bi-envelope text-secondary"></i>
                    </span>
                    <input 
                      type="email" 
                      className="form-control border-start-0 ps-0"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Phone Number (Optional)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <i className="bi bi-phone text-secondary"></i>
                    </span>
                    <input 
                      type="tel" 
                      className="form-control border-start-0 ps-0"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <i className="bi bi-lock text-secondary"></i>
                      </span>
                      <input 
                        type="password" 
                        className="form-control border-start-0 ps-0"
                        placeholder="Min. 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <i className="bi bi-lock-fill text-secondary"></i>
                      </span>
                      <input 
                        type="password" 
                        className="form-control border-start-0 ps-0"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4 mt-3">
                  <label className="form-label small fw-bold">I want to</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className={`form-check p-0 m-0`}>
                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="accountType" 
                          id="customer" 
                          value="customer"
                          checked={formData.accountType === 'customer'}
                          onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                          disabled={isLoading}
                        />
                        <label className="btn btn-outline-primary w-100" htmlFor="customer">
                          <i className="bi bi-person me-2"></i>
                          Shop
                        </label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={`form-check p-0 m-0`}>
                        <input 
                          type="radio" 
                          className="btn-check" 
                          name="accountType" 
                          id="business" 
                          value="business"
                          checked={formData.accountType === 'business'}
                          onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                          disabled={isLoading}
                        />
                        <label className="btn btn-outline-primary w-100" htmlFor="business">
                          <i className="bi bi-briefcase me-2"></i>
                          Sell
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Sign Up
                    </>
                  )}
                </button>

                <div className="divider">
                  <span className="small text-secondary px-3">or sign up with</span>
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary w-100"
                      disabled={isLoading}
                      onClick={() => showNotification('Google signup coming soon!', 'info')}
                    >
                      <i className="bi bi-google me-2"></i>
                      Google
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary w-100"
                      disabled={isLoading}
                      onClick={() => showNotification('Facebook signup coming soon!', 'info')}
                    >
                      <i className="bi bi-facebook me-2"></i>
                      Facebook
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <span className="small text-secondary">Already have an account? </span>
                  <Link to="/login" className="small text-primary text-decoration-none fw-bold">
                    Log in
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
