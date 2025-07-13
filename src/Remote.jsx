
import React, { useState, useEffect } from 'react';
function Remote({ onSelectChannel, onClose }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liveMode, setLiveMode] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const liveChannels = [
    { id: 1, label: 'News', videoId: 'YDvsBbKfLPA' },
    { id: 2, label: 'Wildlife', videoId: 'daqB3i9WYIY' },
    { id: 3, label: 'Live Sports', videoId: 'Cpp2BgJoRCw' }
  ];

  const videoPlaylist = [
    { id: 4, label: 'Channel 1', videoId: 'ekr2nIex040' },
    { id: 5, label: 'Channel 2', videoId: 'IpFX2vq8HKw' },
    { id: 6, label: 'Channel 3', videoId: 'CtRn6eqVnvY' },
    { id: 7, label: 'Channel 4', videoId: 'oKxuiw3iMBE' },
    { id: 8, label: 'Channel 5', videoId: 'KWWRGmWKkfI' },
    { id: 9, label: 'Channel 6', videoId: 'Bx51eegLTY8' }
    
  ];
 

  const currentPlaylist = liveMode ? liveChannels : videoPlaylist;

  // Initial state
  useEffect(() => {
    const player = window.tvPlayer?.current;
    if (player) {
      setIsMuted(player.isMuted());
      const state = player.getPlayerState?.();
      setIsPlaying(state === 1); // 1 = playing
    }
  }, []);

  // Live sync every 1s
  useEffect(() => {
    const interval = setInterval(() => {
      const player = window.tvPlayer?.current;
      if (player?.getPlayerState) {
        setIsMuted(player.isMuted());
        setIsPlaying(player.getPlayerState() === 1);
      }
    }, 1000);
    return () => clearInterval(interval);
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

  const handleSelectChannel = (videoId) => {
    onSelectChannel(videoId);
    const player = window.tvPlayer?.current;
    setTimeout(() => {
      if (isMuted) player?.mute();
      else player?.unMute();
      if (!isPlaying) player?.pauseVideo();
    }, 500); // Give time for new video to load
  };

  const nextVideo = () => {
    const nextIndex = (currentIndex + 1) % videoPlaylist.length;
    setCurrentIndex(nextIndex);
    handleSelectChannel(videoPlaylist[nextIndex].videoId);
  };

  const prevVideo = () => {
    const prevIndex = (currentIndex - 1 + videoPlaylist.length) % videoPlaylist.length;
    setCurrentIndex(prevIndex);
    handleSelectChannel(videoPlaylist[prevIndex].videoId);
  };

  const toggleLiveMode = () => {
    setLiveMode(!liveMode);
    setCurrentIndex(0); // Reset to first video when switching modes
    if (!liveMode) {
      handleSelectChannel(liveChannels[0].videoId);
    } else {
      handleSelectChannel(videoPlaylist[0].videoId);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20%',
      right: '30px',
      background: '#111',
      color: '#fff',
      padding: '20px',
      borderRadius: '12px',
      width: '180px',
      zIndex: 1000
    }}>
      <h3>Remote</h3>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleLiveMode();
        }}
        style={{
          marginBottom: '10px',
          width: '100%',
          backgroundColor: !liveMode ? '#d32f2f' : '#333',
          color: '#fff',
          border: '1px solid #444',
          borderRadius: '6px',
          fontWeight: 'bold'
        }}
      >
        {liveMode ? 'Library' : 'Live'}
      </button>

      {/* 📺 Channel Buttons (only in live mode) */}
      {liveMode && currentPlaylist.map(channel => (
        <button
          key={channel.id}
          onClick={(e) => {
            e.stopPropagation();
            handleSelectChannel(channel.videoId);
          }}
          style={{
            display: 'block',
            margin: '8px 0',
            width: '100%',
            backgroundColor: '#333',
            color: '#ccc',
            border: '1px solid #444',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {channel.label}
        </button>
      ))}

      {!liveMode && (
        <>
          <button onClick={(e)=>{prevVideo(),e.stopPropagation();}} style={{ width: '100%', marginBottom: '6px' }}>◀️ Prev</button>
          <button onClick={(e)=>{nextVideo(),e.stopPropagation();}}style={{ width: '100%', marginBottom: '10px' }}>Next ▶️</button>
        </>
      )}

      {!liveMode && (
        <>
          <button onClick={(e) => {
          e.stopPropagation(); // ✅ prevent pointer lock
          toggleMute();
        }}style={{ width: '100%', marginBottom: '8px' }}>
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
          <button onClick={(e) => {
          e.stopPropagation(); // ✅ prevent pointer lock
          togglePlayPause();
        }} style={{ width: '100%', marginBottom: '8px' }}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </>
      )}

      <button onClick={onClose} style={{ width: '100%' }}>
        Close
      </button>
    </div>
  );
}

export default Remote;
