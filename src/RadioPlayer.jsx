import React, { useEffect, useRef, useState } from 'react';

function RadioPlayer({ onStop }) {
  const playlist = [
    "/The Weeknd - After Hours (Audio).mp3",
    "/Everything In Its Right Place.mp3",
    "/All I Need.mp3",
    "/Fake Plastic Trees.mp3",
    "/How To Disappear Completely.mp3",
    "/Let Down.mp3",
    "/Paranoid Android.mp3",
    "/There There.mp3",
    "/True Love Waits.mp3",

  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(new Audio(playlist[0]));
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = false;
    audio.play();

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [currentIndex]);

  const playCurrent = () => {
    const audio = audioRef.current;
    audio.src = playlist[currentIndex];
    audio.play();
    setIsPlaying(true);
  };

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

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    audioRef.current.src = playlist[nextIndex];
    audioRef.current.play();
    setIsPlaying(true);
  };

  const playPrevious = () => {
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    audioRef.current.src = playlist[prevIndex];
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div 
    className="radio-ui"
    style={{
      position: 'absolute',
      bottom: '50px',
      right: '30px',
      background: '#222',
      color: '#fff',
      padding: '16px',
      borderRadius: '10px',
      width: '180px',
      zIndex: 1000
    }}>
      <h4>Radio</h4>

      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePlayPause();
        }}
        style={{ width: '100%', marginBottom: '8px' }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          playNext();
        }}
        style={{ width: '100%', marginBottom: '8px' }}
      >
        Next ▶️
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          playPrevious();
        }}
        style={{ width: '100%', marginBottom: '8px' }}
      >
        ◀️ Previous
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
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
