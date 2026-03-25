import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import UploadPage from './pages/UploadPage'
import CameraPage from './pages/CameraPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <CustomCursor />

      {/* Ambient floating orbs that fill the empty sides */}
      <div className="ambient-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Navbar />
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/camera" element={<CameraPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
