import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  show: boolean
  onClose: () => void
}

const Toast = ({ message, type, show, onClose }: ToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const bgColor = {
    success: 'linear-gradient(135deg, #2c5530, #4a7a4f)',
    error: 'linear-gradient(135deg, #b33c2c, #c24f3f)',
    info: 'linear-gradient(135deg, #3a6ea5, #5b8cc0)'
  }[type]

  return (
    <div 
      className="position-fixed top-50 start-50 translate-middle" 
      style={{ zIndex: 9999 }}
    >
      <div 
        className="toast show align-items-center border-0" 
        role="alert"
        style={{ background: bgColor, color: 'white' }}
      >
        <div className="d-flex">
          <div className="toast-body">
            <i className={`bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2`}></i>
            {message}
          </div>
          <button type="button" title='close' className="btn-close btn-close-white me-2 m-auto" onClick={onClose}></button>
        </div>
      </div>
    </div>
  )
}

export default Toast
