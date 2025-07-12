
// import React, { Suspense, useRef, useState,useEffect } from 'react';
// import { Canvas, useThree } from '@react-three/fiber';
// import { PointerLockControls } from '@react-three/drei';
// import RoomModel from './RoomModel';
// import PlayerMovement from './PlayerMovement';
// import * as THREE from 'three';
// import Remote from './Remote';

// function App() {
//   const [isLocked, setIsLocked] = useState(false);
//   const controlsRef = useRef();
//   const sceneRef = useRef();
//   const cameraRef = useRef();
//   const [userInstructions, setUserInstructions] = useState(true);
//   const [showRemote, setShowRemote] = useState(false);
// const [tvVideoId, setTvVideoId] = useState(null); // Will hold YouTube video ID
  
  
//   useEffect(() => {
//   const timer = setTimeout(() => {
//     setUserInstructions(false);
//   }, 30000);
//   return () => clearTimeout(timer);
// }, []);

//   const handleButtonClick = (name) => {
//     console.log('Clicked:', name, 'Typeof:', typeof name, 'Lower:', name.toLowerCase());

//     if (name.toLowerCase().includes('cube')) {
//       console.log("TV clicked");
//       setShowRemote(true); // ⬅️ show remote when TV is clicked
      
//     }
//     else if (name.toLowerCase().includes('cylinder')) {
//       console.log("radio clicked");
//       const audio = new Audio("/Recording (44).m4a");
//       audio.play();
//     }
//   };

// const handlePointerDown = (e) => {
//   if (isLocked) return;

//   const raycaster = new THREE.Raycaster();
//   const mouse = new THREE.Vector2();
//   const bounds = e.target.getBoundingClientRect();

//   mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
//   mouse.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

//   if (!cameraRef.current || !sceneRef.current) return;

//   raycaster.setFromCamera(mouse, cameraRef.current);

//   // 🔥 Traverse and collect all interactive meshes
//   const clickableMeshes = [];
//   sceneRef.current.traverse((child) => {
//     if (child.isMesh && child.userData.interactive) {
//       clickableMeshes.push(child);
//     }
//   });

//   const intersects = raycaster.intersectObjects(clickableMeshes, true);
//   intersects.sort((a, b) => a.distance - b.distance);

//   if (intersects.length > 0) {
//     const obj = intersects[0].object;
//     handleButtonClick(obj.name);
//     return;
//   }

//   // If nothing was clicked, enter locked mode
//   requestAnimationFrame(() => {
//     controlsRef.current?.lock();
//   });
// };

// return (
//     <div
//       style={{ width: '100vw', height: '100vh' }}
//       onPointerDown={handlePointerDown}
//     >
//       <Canvas
//         shadows
//         camera={{ position: [0, 2.3, 0], fov: 75 }}
//         onCreated={({ scene, camera }) => {
//           sceneRef.current = scene;
//           cameraRef.current = camera;
//         }}
//       >
//         <ambientLight intensity={2} />
//         <pointLight position={[0, 3, 0]} intensity={10} distance={10} decay={2} color="yellow" />
//         <pointLight position={[5.45, 3.05, -0.15]} intensity={10} distance={10} decay={2} color="yellow" />

//         <Suspense fallback={null}>
//           <RoomModel
//   onButtonClick={handleButtonClick}
//   isLocked={isLocked}
//   tvVideoId={tvVideoId}
// />

//         </Suspense>
//         <PlayerMovement controlsRef={controlsRef} />
//         <PointerLockControls
//           ref={controlsRef}
//           onLock={() => setIsLocked(true)}
//           onUnlock={() => setIsLocked(false)}
//         />
//       </Canvas>
// {userInstructions &&      ( <div
//         style={{
//           position: 'absolute',
//           top: 20,
//           left: 20,
//           color: 'white',
//           background: 'rgba(0,0,0,0.6)',
//           padding: '10px',
//           borderRadius: '10px',
//         }}
//       >
//         Click on objects to interact<br />
//         Double-click elsewhere to enter room<br />
//         Use <b>W A S D</b> to move<br />
//         Press <b>Esc</b> to unlock and interact
//       </div>)
//       };
//       {showRemote && (
//   <Remote
//     onSelectChannel={(videoId) => {
//       setTvVideoId(videoId);
//     }}
//     onClose={() => {setShowRemote(false) ; setTvVideoId(null);}}
//   />
// )}
// {tvVideoId && (
//   <iframe
//     width="480"
//     height="270"
//     src={`https://www.youtube.com/embed/${tvVideoId}?autoplay=1`}
//     title="YouTube video"
//     frameBorder="0"
//     allow="autoplay; encrypted-media"
//     allowFullScreen
//     style={{
//       position: 'absolute',
//       top: '30%',
//       left: '30%',
//       transform: 'translate(-50%, -50%)',
//       borderRadius: '12px',
//       zIndex: 1000
//     }}
//   />
// )}

//     </div>
  


// );}
// export default App;


import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import RoomModel from './RoomModel';
import PlayerMovement from './PlayerMovement';
import * as THREE from 'three';
import Remote from './Remote';

function App() {
  const [isLocked, setIsLocked] = useState(false);
  const controlsRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const [userInstructions, setUserInstructions] = useState(true);
  const [showRemote, setShowRemote] = useState(false);
  const [tvVideoId, setTvVideoId] = useState(null); // YouTube video ID

  // Auto-hide help text after 30s
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserInstructions(false);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  // Handle object clicks (TV / Radio)
  const handleButtonClick = (name) => {
    console.log('Clicked:', name);

    if (name.toLowerCase().includes('cube')) {
      console.log("TV clicked");
      setShowRemote(true);
    } else if (name.toLowerCase().includes('cylinder')) {
      console.log("Radio clicked");
      const audio = new Audio("/Recording (44).m4a");
      audio.play();
    }
  };

  // Handle mouse interaction (raycasting)
  const handlePointerDown = (e) => {
    if (isLocked) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const bounds = e.target.getBoundingClientRect();

    mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouse.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

    if (!cameraRef.current || !sceneRef.current) return;

    raycaster.setFromCamera(mouse, cameraRef.current);

    const clickableMeshes = [];
    sceneRef.current.traverse((child) => {
      if (child.isMesh && child.userData.interactive) {
        clickableMeshes.push(child);
      }
    });

    const intersects = raycaster.intersectObjects(clickableMeshes, true);
    intersects.sort((a, b) => a.distance - b.distance);

    if (intersects.length > 0) {
      const obj = intersects[0].object;
      handleButtonClick(obj.name);
      return;
    }

    // Lock camera if nothing clicked
    requestAnimationFrame(() => {
      controlsRef.current?.lock();
    });
  };

  return (
    <div
      style={{ width: '100vw', height: '100vh' }}
      onPointerDown={handlePointerDown}
    >
      <Canvas
        shadows
        camera={{ position: [0, 2.3, 0], fov: 75 }}
        onCreated={({ scene, camera }) => {
          sceneRef.current = scene;
          cameraRef.current = camera;
        }}
      >
        <ambientLight intensity={2} />
        <pointLight
          position={[0, 3, 0]}
          intensity={10}
          distance={10}
          decay={2}
          color="yellow"
        />
        <pointLight
          position={[5.45, 3.05, -0.15]}
          intensity={10}
          distance={10}
          decay={2}
          color="yellow"
        />

        <Suspense fallback={null}>
          <RoomModel
              onButtonClick={handleButtonClick}
              isLocked={isLocked}
              tvVideoId={tvVideoId}
              showTV={showRemote}
          />

        </Suspense>

        <PlayerMovement controlsRef={controlsRef} />
        <PointerLockControls
          ref={controlsRef}
          onLock={() => setIsLocked(true)}
          onUnlock={() => setIsLocked(false)}
        />
      </Canvas>

      {/* 🛈 Instructions */}
      {userInstructions && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: 'white',
            background: 'rgba(0,0,0,0.6)',
            padding: '10px',
            borderRadius: '10px',
            zIndex: 999,
          }}
        >
          Click on objects to interact<br />
          Double-click elsewhere to enter room<br />
          Use <b>W A S D</b> to move<br />
          Press <b>Esc</b> to unlock and interact
        </div>
      )}

      {/* 🎮 Remote Control */}
      {showRemote && (
        <Remote
          onSelectChannel={(videoId) => {
            setTvVideoId(videoId);
          }}
          onClose={() => {
            setShowRemote(false);
            setTvVideoId(null);
          }}
        />
      )}
    </div>
  );
}

export default App;