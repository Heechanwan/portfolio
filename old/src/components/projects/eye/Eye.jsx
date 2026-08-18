import React, { useState, useEffect } from 'react';

export default function Eye() {
  const [eyeState, setEyeState] = useState(0);

  useEffect(() => {
    let blinkTimer;
    const blinkSequence = () => {
      setEyeState(1); // Полуоткрытое состояние
      setTimeout(() => {
        setEyeState(2); // Закрытое состояние
        setTimeout(() => {
          setEyeState(0); // Открытое состояние
        }, 200); // Длительность закрытого состояния (200ms)
      }, 200); // Длительность полуоткрытого состояния (200ms)
    };

    const startBlinking = () => {
      blinkSequence();
      blinkTimer = setTimeout(startBlinking, 2200); // Запуск следующего цикла моргания через 2.2 секунды
    };

    startBlinking();

    return () => {
      clearTimeout(blinkTimer);
    };
  }, []);

  return (
    <>
      {eyeState === 0 && <img src="./Vector_EYE.png" alt="Open Eye" />}
      {eyeState === 1 && <img src="./Vector_EYE 2.png" alt="Half-Closed Eye" />}
      {eyeState === 2 && <img src="./Vector_EYE 3.png" alt="Closed Eye" />}
    </>
  );
}
