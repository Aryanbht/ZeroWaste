import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CyberBin3D({ isOpen }) {
  const groupRef = useRef()
  const lidRef = useRef()

  // Continuously rotate the entire bin structure on the Y axis
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4
    }
    
    // Animate lid opening/closing
    if (lidRef.current) {
      const targetRotationX = isOpen ? -Math.PI / 1.8 : 0
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        targetRotationX,
        delta * 5
      )
    }
  })

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Base Cylinder Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 0.9, 2.5, 32]} />
        <meshStandardMaterial
          color="#111814"
          metalness={0.8}
          roughness={0.2}
          emissive="#00ffa3"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Glowing Inner Cylinder (visible when lid is open) */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.95, 0.85, 2.4, 32]} />
        <meshBasicMaterial color="#00ffa3" transparent opacity={isOpen ? 0.3 : 0} />
      </mesh>

      {/* The neon rim at the top of the body */}
      <mesh position={[0, 1.25, 0]}>
        <torusGeometry args={[1, 0.03, 16, 32]} />
        <meshBasicMaterial color="#00ffa3" />
      </mesh>

      {/* Lid Group (hinged at the back edge: z = -1) */}
      <group position={[0, 1.25, -1]} ref={lidRef}>
        <mesh position={[0, 0, 1]} castShadow>
          <cylinderGeometry args={[1.05, 1.05, 0.15, 32]} />
          <meshStandardMaterial
            color="#111814"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Lid Top glowing ring */}
        <mesh position={[0, 0.08, 1]}>
           <torusGeometry args={[0.7, 0.02, 16, 32]} />
           <meshBasicMaterial color="#00b8ff" />
        </mesh>
      </group>
    </group>
  )
}
