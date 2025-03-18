import React from 'react';
import { getPlayerStats } from '../data/playerStats';

const PlayerStats = () => {
  const stats = getPlayerStats();

  return (
    <div className="player-stats">
      <h2>Player Statistics</h2>
      
      <div className="stats-section">
        <h3>Blocks</h3>
        <div className="stats-grid">
          {stats.blocks.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-name">{stat.name}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="stats-section">
        <h3>Mobs</h3>
        <div className="stats-grid">
          {stats.mobs.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-name">{stat.name}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="stats-section">
        <h3>Items</h3>
        <div className="stats-grid">
          {stats.items.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-name">{stat.name}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;