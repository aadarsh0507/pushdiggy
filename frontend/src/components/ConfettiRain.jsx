// src/components/ConfettiRain.jsx
import React, { useEffect } from "react";
import confetti from "canvas-confetti";

const ConfettiRain = () => {
  useEffect(() => {
    const duration = 10000; // 10 seconds
    const animationEnd = Date.now() + duration;

    const rainColors = [
      "#FFD700", // Bright Yellow (Gold)
      "#32CD32", // Bright Green (Lime Green)
      "#FF8C00", // Bright Orange (Dark Orange)
      "#FF00FF", // Bright Magenta (Pure Magenta)
      "#FF0000"  // Bright Red (Pure Red)
    ];
    
    
    
    

    const fireRainDrop = (color) => {
      confetti({
        angle: 70,             // vertical drop
        spread: 0,             // no horizontal spread
        startVelocity: 25,     // slower start
        gravity: 0.6,          // steady fall
        ticks: 300,            // longer fall time (reaches middle)
        scalar: 1.3,           // larger drop
        zIndex: 1000,
        shapes: ['square'],    // rectangle-like
        particleCount: 1,
        colors: [color],
        origin: {
          x: Math.random(),
          y:0.0
        },
      });
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      // Fire 1 drop per color every tick
      rainColors.forEach(color => fireRainDrop(color));
    }, 100); // adjust frequency if needed

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default ConfettiRain;
