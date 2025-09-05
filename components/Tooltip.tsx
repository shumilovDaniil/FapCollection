import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const targetRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isVisible) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };
  
  const tooltipElement = isVisible ? (
    <div
      className="fixed z-[100] bg-gray-900 text-white text-sm px-3 py-1.5 rounded-md shadow-lg border border-gray-600 pointer-events-none animate-fade-in transition-transform duration-100"
      style={{
        left: position.x + 15, // Offset from cursor
        top: position.y + 15,
        transform: `translate(-50%, 0)`, // Center the tooltip a bit
        whiteSpace: 'nowrap',
        maxWidth: '250px',
      }}
    >
      {content}
    </div>
  ) : null;

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {tooltipElement && ReactDOM.createPortal(tooltipElement, document.body)}
    </>
  );
};

export default Tooltip;
