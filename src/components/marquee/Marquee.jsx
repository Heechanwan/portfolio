import React from 'react';
import './Marquee.css';

const Marquee = ({ children }) => {
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {children}
        {children} {/* Дублирование контента для непрерывной анимации */}
      </div>
    </div>
  );
};

export default Marquee;
