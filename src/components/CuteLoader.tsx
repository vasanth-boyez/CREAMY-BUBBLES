import React from 'react';
import { Canvas } from '@react-three/fiber';
import IceCream3D from './IceCream3D';

const CuteLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="w-32 h-32 relative">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#B4D4FF" />
          <group rotation={[0, 0, 0]} scale={1.2}>
            <IceCream3D color="#FF6B9D" />
          </group>
        </Canvas>
      </div>
      <div className="text-2xl font-black text-candy-purple animate-bounce-gentle">
        Loading yummy treats...
      </div>
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-candy-pink rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 bg-candy-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-candy-yellow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default CuteLoader;
