import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import RoomModel from './RoomModel';
import PlayerMovement from './PlayerMovement';
import * as THREE from 'three';
import Remote from './Remote';
import RadioPlayer from './RadioPlayer';
function App() {
  const [isLocked, setIsLocked] = useState(false);
  const controlsRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const [userInstructions, setUserInstructions] = useState(true);

  const [tvMuted, setTvMuted] = useState(false);
const [tvPlaying, setTvPlaying] = useState(true);

  const [showRemote, setShowRemote] = useState(false);
  const [tvVideoId, setTvVideoId] = useState(null); // YouTube video ID

  const [radioPlaying, setRadioPlaying] = useState(false);
useEffect(() => {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;

  const suppressClickToLock = (e) => {
    let el = e.target;
    while (el) {
      if (
        el.tagName === 'IFRAME' ||
        el.classList?.contains('remote-ui') ||
        el.closest('.remote-ui') ||
        el.classList?.contains('radio-ui') ||
        el.closest('.radio-ui')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      el = el.parentElement;
    }
  };

  canvas.addEventListener('click', suppressClickToLock, true);
  return () => canvas.removeEventListener('click', suppressClickToLock, true);
}, []);



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
      setRadioPlaying(true);
      
    }
  };

  // Handle mouse interaction (raycasting)
  const handlePointerDown = (e) => {
    let el = e.target;
  while (el) {
    if (el.tagName === 'IFRAME' || el.closest('.remote-ui')) {
      return;
    }
    el = el.parentElement;
  }
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
    // requestAnimationFrame(() => {
    //   controlsRef.current?.lock();
    // });
  };
  const handleDoubleClick = (e) => {
  if (!isLocked) {
    controlsRef.current?.lock();
  }
};


  return (
    <div
  style={{ width: '100vw', height: '100vh' }}
  onPointerDown={handlePointerDown}
  onDoubleClick={handleDoubleClick}
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
  tvMuted={tvMuted}
  tvPlaying={tvPlaying}
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
  <div
    className="remote-ui" // 👈 this is now used for click filtering
    style={{
      position: 'absolute',
      top: '10%',
      right: '30px',
      zIndex: 1000,
    }}
  >
    <Remote
      onSelectChannel={(videoId) => setTvVideoId(videoId)}
      onClose={() => {
        if (window.tvPlayer?.current?.stopVideo) {
          window.tvPlayer.current.stopVideo();
        }
        
        setShowRemote(false);
        setTimeout(() => setTvVideoId(null), 100);
      }}
      tvMuted={tvMuted}
  setTvMuted={setTvMuted}
  tvPlaying={tvPlaying}
  setTvPlaying={setTvPlaying}

    />
  </div>
)}



      { /*radio controler*/ }
      {radioPlaying && (
      <RadioPlayer onStop={() => setRadioPlaying(false)} />
    )}
    </div>
  );
}

export default App;

