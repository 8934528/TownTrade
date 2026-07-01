import { useEffect } from 'react'

interface InfoModalProps {
  show: boolean
  onClose: () => void
  title: string
  body: string
}

const InfoModal = ({ show, onClose, title, body }: InfoModalProps) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [show])

  if (!show) return null

  return (
    <div 
      className="modal show d-flex align-items-center" 
      style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className="modal-content gradient-overlay">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" title='close' className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" dangerouslySetInnerHTML={{ __html: body }} />
          <div className="modal-footer border-0 pt-0">
            <button type="button" className="btn btn-primary px-4" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoModal
