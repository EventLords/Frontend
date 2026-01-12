import React from 'react';
import './AnimatedBackground.css';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="animated-bg">
      <div className="animated-bg-shapes">
        {/* Calendar-like squares */}
        <div className="floating-shape square" />
        <div className="floating-shape square" />
        <div className="floating-shape square" />
        <div className="floating-shape square" />
        
        {/* Connection dots */}
        <div className="floating-shape dot" />
        <div className="floating-shape dot" />
        <div className="floating-shape dot" />
        <div className="floating-shape dot" />
        
        {/* Hexagons - network/connections */}
        <div className="floating-shape hexagon" />
        <div className="floating-shape hexagon" />
        <div className="floating-shape hexagon" />
        
        {/* Lines - timelines */}
        <div className="floating-shape line" />
        <div className="floating-shape line" />
        <div className="floating-shape line" />
        
        {/* Rings - event cycles */}
        <div className="floating-shape ring" />
        <div className="floating-shape ring" />
        <div className="floating-shape ring" />
      </div>
    </div>
  );
};

export default AnimatedBackground;
