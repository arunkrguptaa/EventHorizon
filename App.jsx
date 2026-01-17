import React from 'react';
import { Canvas } from 'react-three-fiber';

const App = () => {
  return (
    <Canvas>
      {/* Add your Three.js components here */}
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* You can add more 3D objects here */}
    </Canvas>
  );
};

export default App;