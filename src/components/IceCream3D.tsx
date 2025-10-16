import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';

interface IceCream3DProps {
  color: string;
}

const IceCream3D: React.FC<IceCream3DProps> = ({ color }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ice cream scoop - shinier and more vibrant */}
      <Sphere args={[0.6, 64, 64]} position={[0, 0.5, 0]}>
        <meshStandardMaterial 
          color={color} 
          roughness={0.1}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Sphere>
      
      {/* Cone - warmer color */}
      <Cone args={[0.5, 1.2, 32]} position={[0, -0.4, 0]}>
        <meshStandardMaterial 
          color="#E89B5E" 
          roughness={0.6}
          metalness={0.1}
        />
      </Cone>
      
      {/* Second scoop - extra shiny */}
      <Sphere args={[0.4, 64, 64]} position={[0, 1.2, 0]}>
        <meshStandardMaterial 
          color={color} 
          roughness={0.1}
          metalness={0.5}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </Sphere>
      
      {/* Cherry on top */}
      <Sphere args={[0.15, 32, 32]} position={[0, 1.6, 0]}>
        <meshStandardMaterial 
          color="#FF1744" 
          roughness={0.1}
          metalness={0.8}
          emissive="#FF1744"
          emissiveIntensity={0.8}
        />
      </Sphere>
    </group>
  );
};

export default IceCream3D;
