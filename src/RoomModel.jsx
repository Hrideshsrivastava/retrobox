import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import IframeTV from './IframeTV';

function RoomModel({ onButtonClick, isLocked, tvVideoId, showTV, tvMuted, tvPlaying }) {
  const { scene } = useGLTF('/room3.glb');
  const group = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (!child.name.toLowerCase().includes('cube_1')) {
          const parentName = child.parent?.name?.toLowerCase();
          if (parentName === 'television' || parentName === 'radio') {
            child.userData.interactive = true;
          }
        }
      }
    });
  }, [scene]);

  return (
    <>
      <primitive object={scene} ref={group} />
      {tvVideoId && (
        <IframeTV
          videoId={tvVideoId}
          visible={showTV}
          tvMuted={tvMuted}
          tvPlaying={tvPlaying}
        />
      )}
    </>
  );
}

export default RoomModel;
