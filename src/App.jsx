
import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import RoomModel from './RoomModel';
import PlayerMovement from './PlayerMovement';
import * as THREE from 'three';

function App() {
  const [isLocked, setIsLocked] = useState(false);
  const controlsRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();

  const handleButtonClick = (name) => {
    console.log('Clicked:', name);
    if (name.toLowerCase().includes('television')) {
      console.log("TV clicked");
    }
    if (name.toLowerCase().includes('Cylinder002_1')) {
      const audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
      audio.play();
    }
  };

  const handlePointerDown = (e) => {
    if (isLocked) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const bounds = e.target.getBoundingClientRect();

    mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouse.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

    if (!cameraRef.current || !sceneRef.current) return;

    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      const obj = intersects[0].object;
      if (obj.userData.interactive) {
        handleButtonClick(obj.name);
        return;
      }
    }

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
        <pointLight position={[0, 3, 0]} intensity={10} distance={10} decay={2} color="yellow" />
        <pointLight position={[5.45, 3.05, -0.15]} intensity={10} distance={10} decay={2} color="yellow" />

        <Suspense fallback={null}>
          <RoomModel onButtonClick={handleButtonClick} isLocked={isLocked} />
        </Suspense>
        <PlayerMovement controlsRef={controlsRef} />
        <PointerLockControls
          ref={controlsRef}
          onLock={() => setIsLocked(true)}
          onUnlock={() => setIsLocked(false)}
        />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'white',
          background: 'rgba(0,0,0,0.6)',
          padding: '10px',
          borderRadius: '10px',
        }}
      >
        Click on objects to interact<br />
        Double-click elsewhere to enter room<br />
        Use <b>W A S D</b> to move<br />
        Press <b>Esc</b> to unlock and interact
      </div>
    </div>
  );
}

export default App;
