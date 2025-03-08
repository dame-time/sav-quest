import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export const StepCompletionEffect = ({ show }) => {
  const confettiRef = useRef(null);
  
  useEffect(() => {
    if (show && confettiRef.current) {
      const canvas = confettiRef.current;
      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
      });
      
      // Fire confetti
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#1e40af', '#1d4ed8'],
        gravity: 0.8,
        scalar: 1.2,
        ticks: 200
      });
      
      // Add a second burst with different settings
      setTimeout(() => {
        myConfetti({
          particleCount: 50,
          spread: 100,
          origin: { y: 0.7 },
          colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#1e40af', '#1d4ed8'],
          gravity: 0.6,
          scalar: 0.8,
          ticks: 150
        });
      }, 250);
    }
  }, [show]);
  
  return (
    <canvas
      ref={confettiRef}
      className={`fixed inset-0 z-50 pointer-events-none ${show ? 'opacity-100' : 'opacity-0'}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

// Helper function to trigger the completion effect
export const triggerCompletionEffect = () => {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  
  // Create a temporary canvas element
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  container.appendChild(canvas);
  
  // Create confetti instance
  const myConfetti = confetti.create(canvas, {
    resize: true,
    useWorker: true
  });
  
  // Fire confetti
  myConfetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#1e40af', '#1d4ed8'],
    gravity: 0.8,
    scalar: 1.2,
    ticks: 200
  });
  
  // Add a second burst with different settings
  setTimeout(() => {
    myConfetti({
      particleCount: 50,
      spread: 100,
      origin: { y: 0.7 },
      colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#1e40af', '#1d4ed8'],
      gravity: 0.6,
      scalar: 0.8,
      ticks: 150
    });
  }, 250);
  
  // Remove the canvas after animation completes
  setTimeout(() => {
    container.removeChild(canvas);
  }, 3000);
}; 