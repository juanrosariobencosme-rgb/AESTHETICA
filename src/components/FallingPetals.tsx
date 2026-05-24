import { useEffect, useState } from 'react';

const FallingPetals = () => {
  const [petals, setPetals] = useState<Array<{id: number, x: number, delay: number, rotation: number}>>([]);

  useEffect(() => {
    const createPetal = () => {
      const id = Date.now() + Math.random();
      setPetals(prev => [...prev.slice(-25), { 
        id, 
        x: Math.random() * 100, 
        delay: Math.random() * 2,
        rotation: Math.random() * 360
      }]);
    };

    const interval = setInterval(createPetal, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
      {petals.map(petal => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            width: '30px',
            height: '30px',
            opacity: 0.7,
            animation: `fall ${8 + petal.delay}s linear forwards`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
          }}
          onAnimationEnd={() => {
            setPetals(prev => prev.filter(p => p.id !== petal.id));
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{
              fill: '#C5A880',
              transform: `rotate(${petal.rotation}deg)`
            }}
          >
            <path d="M50 0 C60 30 70 40 100 50 C70 60 60 70 50 100 C40 70 30 60 0 50 C30 40 40 30 50 0 Z" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            top: -50px;
            opacity: 0;
            transform: scale(0.3) rotate(0deg);
          }
          5% {
            opacity: 0.7;
            transform: scale(1) rotate(45deg);
          }
          100% {
            top: 110vh;
            opacity: 0.5;
            transform: scale(1) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default FallingPetals;
