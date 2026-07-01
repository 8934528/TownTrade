import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

interface LoginProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const Login = ({ showNotification }: LoginProps) => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    try {
      await login({
        username: formData.email,
        password: formData.password,
        remember_me: formData.rememberMe
      });
      showNotification('Login successful! Welcome back.', 'success');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      showNotification(message, 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card">
              <div className="text-center mb-4">
                <h2 className="fs-2 fw-bold text-primary mb-1">Welcome Back</h2>
                <p className="text-secondary small">Sign in to continue to TownTrade</p>
              </div>
              
              <form onSubmit={handleSubmit}>
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

                <div className="mb-4">
                  <label className="form-label small fw-bold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <i className="bi bi-lock text-secondary"></i>
                    </span>
                    <input 
                      type="password" 
                      className="form-control border-start-0 ps-0"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input" 
                      id="remember" 
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                      disabled={isLoading}
                    />
                    <label className="form-check-label small" htmlFor="remember">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="small text-primary text-decoration-none">
                    Forgot password?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Log In
                    </>
                  )}
                </button>

                <div className="divider">
                  <span className="small text-secondary px-3">or continue with</span>
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary w-100"
                      disabled={isLoading}
                      onClick={() => showNotification('Google login coming soon!', 'info')}
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
                      onClick={() => showNotification('Facebook login coming soon!', 'info')}
                    >
                      <i className="bi bi-facebook me-2"></i>
                      Facebook
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <span className="small text-secondary">Don't have an account? </span>
                  <Link to="/signup" className="small text-primary text-decoration-none fw-bold">
                    Sign up
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

export default Login;
