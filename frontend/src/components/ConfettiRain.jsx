// src/components/ConfettiRain.jsx
import React, { useEffect } from "react";
import confetti from "canvas-confetti";

const ConfettiRain = () => {
  useEffect(() => {
    const duration = 120000; // 15 sec
    const animationEnd = Date.now() + duration;

    // const defaults = {
    //   angle: 90, // straight down
    //   spread: 10, // bit wide spread
    //   startVelocity: 20, // slightly faster
    //   ticks: 5000, // ⬅️ LONGER life to fall FULL screen
    //   gravity: 0.10, // slow smooth fall
    //   zIndex: 500,
    //   scalar: 1.2,
    //   colors: ["#FDCB6E", "#FF8C00", "#FF3CAC", "#00BFFF", "#A29BFE"],
    // };

    const defaults = {
      angle: 90, // straight down
      spread: 5, // 🔽 reduce spread for tighter fall
      startVelocity: 20,
      ticks: 5000,
      gravity: 0.1,
      zIndex: 500,
      scalar: 1.2,
      colors: ["#FDCB6E", "#FF8C00", "#FF3CAC", "#00BFFF", "#A29BFE"],
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      // confetti({
      //   ...defaults,
      //   particleCount: 2,
      //   origin: {
      //     x: Math.random(),
      //     y: 0.0, // always top of screen
      //   },
      // });
      confetti({
        ...defaults,
        particleCount: 1, // 🔽 show fewer pieces each time
        origin: {
          x: Math.random(),
          y: 0.0,
        },
      });
    }, 300); // smoother frequency
  }, []);

  return null;
};

export default ConfettiRain;
