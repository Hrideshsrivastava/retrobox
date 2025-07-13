import React, { useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';

const IframeTV = ({ videoId, visible, tvMuted, tvPlaying }) => {
  const iframeRef = useRef();
  const playerRef = useRef();

  // Load YouTube API once
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }, []);

  // Setup player
  useEffect(() => {
    if (!visible || !videoId || !window.YT || !iframeRef.current) return;

    const onPlayerReady = (event) => {
      if (tvMuted) event.target.mute();
      else event.target.unMute();

      if (tvPlaying) event.target.playVideo();
      else event.target.pauseVideo();
    };

    playerRef.current = new window.YT.Player(iframeRef.current, {
      videoId: videoId,
      events: {
        onReady: onPlayerReady,
      },
      playerVars: {
        autoplay: 1,
        mute: tvMuted ? 1 : 0,
        enablejsapi: 1,
      },
    });

    window.tvPlayer = playerRef; // global access

    return () => {
      try {
        playerRef.current?.destroy?.();
        playerRef.current = null;
      } catch (err) {
        console.warn("Player destroy failed:", err);
      }
    };
  }, [videoId, visible, tvMuted, tvPlaying]);

  return (
    <mesh position={[-1.7, 2.4, 0.1]} rotation={[0, 1.6, 0]}>
      <planeGeometry args={[0.65, 0.45]} />
      <meshBasicMaterial transparent opacity={0} />
      <Html transform distanceFactor={1.5} position={[0, 0, 0.01]}>
        <div style={{ display: visible ? 'block' : 'none' }}>
          <div
            id="tv-iframe"
            ref={iframeRef}
            style={{
              width: '340px',
              height: '210px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#000',
            }}
          />
        </div>
      </Html>
    </mesh>
  );
};

export default IframeTV;
