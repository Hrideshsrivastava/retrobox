// import React, { Suspense, useRef } from 'react';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { PointerLockControls, useGLTF } from '@react-three/drei';
// import * as THREE from 'three';
// import PlayerMovement from './PlayerMovement.jsx';
// function RoomModel({ onButtonClick }) {
//   const { scene } = useGLTF('/room2.glb');

//   scene.traverse((child) => {
//     if (child.isMesh && child.name.includes('Button')) {
//       child.userData.interactive = true;
//     }
//   });

//   scene.position.set(0, -1, -2);

//   return (
//     <primitive
//       object={scene}
//       onClick={(e) => {
//         const clicked = e.object;
//         if (clicked.userData.interactive) {
//           onButtonClick(clicked.name);
//         }
//       }}
//     />
//   );
// }


// function App() {
//   const handleButtonClick = (name) => {
//     console.log('Clicked:', name);
//     if (name === 'Television') {
//      console.log("tv clicked");
//     }
//     if (name === 'Radio') {
//       const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
//       audio.play();
//     }
//   };


//   return (
//     <div style={{ width: '100vw', height: '100vh' }}>
//       <Canvas frameloop="always" shadows camera={{ position: [0, 2, 5], fov: 50 }}>


//         <ambientLight intensity={1.5} />
//         <directionalLight position={[5, 5, 5]} intensity={0.5} />
//         <Suspense fallback={null}>
//           <RoomModel onButtonClick={handleButtonClick} />
//         </Suspense>
//         <PlayerMovement />
//       </Canvas>
//       <div style={{
//         position: 'absolute',
//         top: 20,
//         left: 20,
//         color: 'white',
//         background: 'rgba(0,0,0,0.6)',
//         padding: '10px',
//         borderRadius: '10px'
//       }}>
//         Click to enter the room<br />
//         Use <b>W A S D</b> to move
//       </div>
//     </div>
//   );
// }

// export default App;
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import PlayerMovement from './PlayerMovement.jsx';

function RoomModel({ onButtonClick }) {
  const { scene } = useGLTF('/room2.glb');

  scene.traverse((child) => {
    if (child.isMesh && child.name.includes('Button')) {
      child.userData.interactive = true;
    }
  });

  scene.position.set(0, -1, 0);
  return (
    <primitive
      object={scene}
      onClick={(e) => {
        const clicked = e.object;
        if (clicked.userData.interactive) {
          onButtonClick(clicked.name);
        }
      }}
    />
  );
}



function App() {
  const handleButtonClick = (name) => {
    console.log('Clicked:', name);
    if (name === 'Television') {
     console.log("tv clicked");
    }
    if (name === 'Radio') {
      const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
      audio.play();
    }
  };


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [0, 1.7, 0], fov: 75 }}>

        <ambientLight intensity={3} />
        {/* <directionalLight position={[0, 1.7,0 ]} intensity={10.5} /> */}
        <pointLight position={[-0.0, 3, 0.01]} intensity={10} distance={10} decay={2} color="yellow" />
        <pointLight position={[5.45, 3.05, - 0.15]} intensity={10} distance={10} decay={2} color="cyan" />
        {/* <mesh position={[-0.0, 3, 0.01]}>
          
  <sphereGeometry args={[0.1, 16, 16]} />
  <meshStandardMaterial emissive="#ffdfa0" emissiveIntensity={10000} color="white" />
</mesh>
<mesh position={[5.45, 3.05, - 0.15]}>
          
  <sphereGeometry args={[0.1, 16, 16]} />
  <meshStandardMaterial emissive="#ffdfa0" emissiveIntensity={10000} color="white" />
</mesh> */}
        <Suspense fallback={null}>
          <RoomModel onButtonClick={handleButtonClick} />
        </Suspense>
        <PlayerMovement />
      </Canvas>
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        background: 'rgba(0,0,0,0.6)',
        padding: '10px',
        borderRadius: '10px'
      }}>
        Click to enter the room<br />
        Use <b>W A S D</b> to move
      </div>
    </div>
  );
}

export default App;
