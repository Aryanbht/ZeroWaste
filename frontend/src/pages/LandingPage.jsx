import { useState, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Environment, SoftShadows } from '@react-three/drei'
import CyberBin3D from '../components/CyberBin3D'
import './LandingPage.css'

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleBinClick = () => {
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <div className="landing-container">
      <div className="landing-header fade-in">
        <h1>Zero-Waste Vision</h1>
        <p>Initialize scanning protocol. Click the containment unit to begin.</p>
      </div>

      <div className="scene-container">
        
        {/* Absolute overlay for the 3D Canvas */}
        <div className="canvas-wrapper" onClick={handleBinClick}>
          <Canvas camera={{ position: [0, 2, 6], fov: 45 }} shadows>
            <SoftShadows />
            <ambientLight intensity={0.4} />
            <pointLight position={[5, 5, 5]} intensity={2} color="#00ffa3" castShadow />
            <pointLight position={[-5, 5, -5]} intensity={1.5} color="#00b8ff" />
            
            <Suspense fallback={null}>
              <CyberBin3D isOpen={isOpen} />
            </Suspense>
          </Canvas>
        </div>

        {/* The crushed papers that fly out */}
        <div className={`paper-ball left-paper ${isOpen ? 'fly-out-left' : ''}`} onClick={() => handleNavigate('/upload')}>
          <div className="crumple-shape">
            <span className="emoji">📸</span>
          </div>
          <div className="nav-label">Image Upload</div>
        </div>

        <div className={`paper-ball right-paper ${isOpen ? 'fly-out-right' : ''}`} onClick={() => handleNavigate('/camera')}>
          <div className="crumple-shape">
            <span className="emoji">📹</span>
          </div>
          <div className="nav-label">Live Camera</div>
        </div>
        
      </div>
      
      {!isOpen && (
        <div className="click-hint pulse-hint">
          TAP TO OPEN
        </div>
      )}
    </div>
  )
}
