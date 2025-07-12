// RadioPlayer.jsx
import React, { useEffect, useRef, useState } from 'react';

function RadioPlayer({ onStop }) {
  const audioRef = useRef(new Audio("/Recording (44).m4a"));
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '40px',
      right: '30px',
      background: '#222',
      color: '#fff',
      padding: '16px',
      borderRadius: '10px',
      width: '160px',
      zIndex: 1000
    }}>
      <h4>Radio</h4>
      <button
        onClick={togglePlayPause}
        style={{ width: '100%', marginBottom: '8px' }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button
        onClick={() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          onStop();
        }}
        style={{ width: '100%' }}
      >
        Stop Radio
      </button>
    </div>
  );
}

export default RadioPlayer;
