import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

function RoomModel({ onButtonClick, isLocked }) {
  const { scene } = useGLTF('/room3.glb');
  const group = useRef();

  useEffect(() => {
  scene.traverse((child) => {
    if (child.isMesh) {
      const parentName = child.parent?.name?.toLowerCase();
      if (parentName === 'television' || parentName === 'radio') {
        child.userData.interactive = true;
        console.log('Interactive:', child.name, '→ Parent:', parentName);
      }
    }
  });
}, [scene]);


  useEffect(() => {
  console.log('Scene graph:');
  scene.traverse((child) => {
    if (child.isMesh) {
      console.log('Mesh:', child.name);
      child.userData.interactive = true;
    } else {
      console.log('Other:', child.type, child.name);
    }
  });
}, [scene]);


  return (
    <primitive
      object={scene}
      ref={group}
      onClick={(e) => {
        if (!isLocked && e.object.userData.interactive) {
          e.stopPropagation();
          onButtonClick(e.object.name);
        }
      }}
    />
  );
}

export default RoomModel;
