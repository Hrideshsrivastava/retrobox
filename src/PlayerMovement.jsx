import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

function PlayerMovement() {
  const { camera } = useThree();
  const controlsRef = useRef();
  const keys = useRef({});
  const speed = 3;
  const direction = new THREE.Vector3();
  const velocity = new THREE.Vector3();


  useEffect(() => {
    const handleKeyDown = (e) => (keys.current[e.code] = true);
    const handleKeyUp = (e) => (keys.current[e.code] = false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    
    if (!controlsRef.current?.isLocked) return;

    direction.set(0, 0, 0);
    direction
    if (keys.current['KeyW']) direction.z += 1;
    if (keys.current['KeyS']) direction.z -= 1;
    if (keys.current['KeyA']) direction.x -= 1;
    if (keys.current['KeyD']) direction.x += 1;

    direction.normalize();

    // get direction camera is facing
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    // apply movement in local directions
    const moveVector = new THREE.Vector3();
    moveVector.addScaledVector(forward, direction.z);
    moveVector.addScaledVector(right, direction.x);
    moveVector.multiplyScalar(speed * delta);

    camera.position.add(moveVector);
    camera.position.x = Math.max(-1.54, Math.min(7.79, camera.position.x));
  camera.position.z = Math.max(-3.26, Math.min(3.13, camera.position.z));
  });

 

  return <PointerLockControls ref={controlsRef} />;
}

export default PlayerMovement;
