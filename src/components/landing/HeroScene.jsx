import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Stars, Sparkles } from '@react-three/drei'

function CoreOrb() {
  const mesh = useRef(null)
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    mesh.current.rotation.x = t * 0.09
    mesh.current.rotation.y = t * 0.14
  })
  return (
    <Float speed={2} rotationIntensity={0.45} floatIntensity={0.95}>
      <mesh ref={mesh} scale={2.05}>
        <icosahedronGeometry args={[1, 3]} />
        <MeshDistortMaterial
          color="#6b82ff"
          emissive="#1e1050"
          emissiveIntensity={0.52}
          roughness={0.12}
          metalness={0.92}
          distort={0.38}
          speed={2.4}
          radius={0.95}
        />
      </mesh>
    </Float>
  )
}

function Rings() {
  const group = useRef(null)
  useFrame((_, dt) => {
    if (!group.current) return
    group.current.rotation.z += dt * 0.06
    group.current.rotation.y += dt * 0.1
  })
  const colors = ['#506cff', '#8fa4ff', '#c4d0ff']
  return (
    <group ref={group}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2.2 + i * 0.35, i * 0.65, i * 0.2]}>
          <torusGeometry args={[2.35 + i * 0.42, 0.028, 16, 96]} />
          <meshBasicMaterial color={colors[i]} transparent opacity={0.22 + i * 0.15} />
        </mesh>
      ))}
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.38} />
      <directionalLight position={[9, 7, 5]} intensity={1.15} color="#f2f4ff" />
      <directionalLight position={[-5, -3, 2]} intensity={0.35} color="#5b6cff" />
      <pointLight position={[-7, -2, 3]} intensity={0.9} color="#7c5cff" distance={20} />
      <Stars radius={90} depth={45} count={3200} factor={2.8} saturation={0.08} fade speed={0.25} />
      <CoreOrb />
      <Rings />
      <Sparkles count={90} scale={9} size={2.6} speed={0.4} opacity={0.55} color="#b8c8ff" />
    </>
  )
}

export default function HeroScene() {
  return (
    <div style={{ width: '100%', height: '100%', touchAction: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 7.6], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
