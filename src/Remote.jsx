import React, { useState, useEffect } from 'react';

function Remote({ onSelectChannel, onClose }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const player = window.tvPlayer?.current;
    if (player) {
      setIsMuted(player.isMuted());
      setIsPlaying(true); // assume it's playing by default
    }
  }, []);

  const toggleMute = () => {
    const player = window.tvPlayer?.current;
    if (!player) return;

    if (player.isMuted()) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const togglePlayPause = () => {
    const player = window.tvPlayer?.current;
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  const channels = [
    { id: 1, label: 'Channel 1', videoId: 'dQw4w9WgXcQ' },
    { id: 2, label: 'Channel 2', videoId: '3JZ_D3ELwOQ' },
    { id: 3, label: 'Channel 3', videoId: '9bZkp7q19f0' }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '20%',
      right: '30px',
      background: '#111',
      color: '#fff',
      padding: '20px',
      borderRadius: '12px',
      width: '150px',
      zIndex: 1000
    }}>
      <h3>Remote</h3>

      {channels.map(channel => (
        <button
          key={channel.id}
          onClick={(e) => {
            e.stopPropagation(); // ✅ prevent pointer lock
            onSelectChannel(channel.videoId);
          }}
          style={{ display: 'block', margin: '8px 0', width: '100%' }}
        >
          {channel.label}
        </button>
      ))}

      <hr />

      {/* 🔇 Mute Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // ✅ prevent pointer lock
          toggleMute();
        }}
        style={{ marginBottom: '8px', width: '100%' }}
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>

      {/* ⏯️ Play/Pause Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // ✅ prevent pointer lock
          togglePlayPause();
        }}
        style={{ marginBottom: '8px', width: '100%' }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation(); // ✅ prevent pointer lock
          onClose();
        }}
        style={{ width: '100%' }}
      >
        Close
      </button>
    </div>
  );
}

export default Remote;
