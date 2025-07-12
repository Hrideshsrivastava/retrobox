// Remote.jsx
import React from 'react';

function Remote({ onSelectChannel, onClose }) {
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
          onClick={() => onSelectChannel(channel.videoId)}
          style={{ display: 'block', margin: '8px 0', width: '100%' }}
        >
          {channel.label}
        </button>
      ))}
      <button onClick={onClose} style={{ marginTop: '10px', width: '100%' }}>Close</button>
    </div>
  );
}

export default Remote;
