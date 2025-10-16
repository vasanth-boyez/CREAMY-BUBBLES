import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from 'lucide-react';
import IceCream3D from './IceCream3D';
import * as THREE from 'three';

interface FloatingIceCreamProps {
  position: [number, number, number];
  color: string;
  speed: number;
  rotationSpeed: number;
}

const FloatingIceCream: React.FC<FloatingIceCreamProps> = ({ 
  position, 
  color, 
  speed,
  rotationSpeed 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const startY = position[1];

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y = startY + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      // Continuous rotation
      groupRef.current.rotation.y += rotationSpeed;
      // Gentle side-to-side drift
      groupRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={0.4}>
      <IceCream3D color={color} />
    </group>
  );
};

const AnimatedBackground = () => {
  const colors = ['#FF6B9D', '#4ECDC4', '#A78BFA', '#34D399', '#FBBF24', '#F472B6', '#FFA07A', '#98D8C8', '#E6B3FF'];
  
  const iceCreamPositions = [
    { pos: [-8, 3, -5], color: colors[0], speed: 0.6, rotation: 0.01 },
    { pos: [8, -1, -5], color: colors[1], speed: 0.8, rotation: -0.008 },
    { pos: [-6, -3, -8], color: colors[2], speed: 0.5, rotation: 0.012 },
    { pos: [6, 4, -6], color: colors[3], speed: 0.7, rotation: -0.01 },
    { pos: [0, -2, -10], color: colors[4], speed: 0.9, rotation: 0.009 },
    { pos: [-3, 5, -7], color: colors[5], speed: 0.6, rotation: -0.011 },
    { pos: [3, 1, -9], color: colors[6], speed: 0.75, rotation: 0.013 },
    { pos: [-7, 0, -6], color: colors[7], speed: 0.65, rotation: -0.009 },
    { pos: [7, 2, -8], color: colors[8], speed: 0.85, rotation: 0.011 },
    { pos: [-4, -4, -7], color: colors[0], speed: 0.55, rotation: 0.014 },
  ];

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.6} />
          <pointLight position={[-10, -10, -5]} intensity={0.3} color="#B4D4FF" />
          
          {iceCreamPositions.map((item, index) => (
            <FloatingIceCream
              key={index}
              position={item.pos as [number, number, number]}
              color={item.color}
              speed={item.speed}
              rotationSpeed={item.rotation}
            />
          ))}
        </Canvas>
      </div>
      
      {/* Sparkle elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 20 }, (_, i) => ({
          id: i,
          delay: Math.random() * 3,
          duration: 2 + Math.random() * 2,
          left: Math.random() * 100,
          top: Math.random() * 100,
        })).map((sparkle) => (
          <div
            key={`sparkle-${sparkle.id}`}
            className="absolute animate-pulse"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
            }}
          >
            <Sparkles
              size={Math.random() > 0.5 ? 20 : 16}
              className={sparkle.id % 3 === 0 ? "text-candy-pink" : sparkle.id % 3 === 1 ? "text-candy-blue" : "text-candy-yellow"}
              style={{
                filter: 'drop-shadow(0 0 12px currentColor)',
                opacity: 0.4,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default AnimatedBackground;
