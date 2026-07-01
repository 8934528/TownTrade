import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider } from './contexts/AuthProvider'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import InfoModal from './components/InfoModal'
import Home from './pages/Start/Home'
import ForBusinesses from './pages/ForBusinesses/ForBusinesses'
import ForCustomers from './pages/ForCustomers/ForCustomers'
import GetStarted from './pages/Start/GetStarted'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import BusinessesDash from './pages/BusinessesDash/BusinessesDash'
import CustomersDash from './pages/CustomersDash/CustomersDash'
import './App.css'

function App() {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info')
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', body: '' })

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const openModal = (title: string, body: string) => {
    setModalContent({ title, body })
    setShowModal(true)
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar openModal={openModal} />
        <main className="flex-grow-1" style={{ paddingTop: '80px' }}>
          <Routes>
            <Route path="/" element={<Home showNotification={showNotification} openModal={openModal} />} />
            <Route path="/for-businesses" element={<ForBusinesses showNotification={showNotification} openModal={openModal} />} />
            <Route path="/for-customers" element={<ForCustomers showNotification={showNotification} openModal={openModal} />} />
            <Route path="/get-started" element={<GetStarted showNotification={showNotification} openModal={openModal} />} />
            <Route path="/login" element={<Login showNotification={showNotification} />} />
            <Route path="/signup" element={<SignUp showNotification={showNotification} />} />
            <Route path="/business-dash" element={<BusinessesDash showNotification={showNotification} />} />
            <Route path="/customer-dash" element={<CustomersDash showNotification={showNotification} />} />
          </Routes>
        </main>
        <Footer />
        <Toast 
          message={toastMessage} 
          type={toastType} 
          show={showToast} 
          onClose={() => setShowToast(false)} 
        />
        <InfoModal
          show={showModal}
          onClose={() => setShowModal(false)}
          title={modalContent.title}
          body={modalContent.body}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
