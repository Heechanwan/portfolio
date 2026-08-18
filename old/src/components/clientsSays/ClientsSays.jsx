import React, { useEffect, useRef } from 'react';
import './ClientsSays.css';

export default function ClientsSays() {
  const imagesRef = useRef(null);
  const h2Ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const images = imagesRef.current;
      const h2 = h2Ref.current;
      const imagesTop = images.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const threshold = windowHeight * 0.5;

      if (imagesTop <= windowHeight - threshold) {
        Array.from(images.children).forEach(image => {
            image.classList.add('show');
        });
        setTimeout(() => {
          h2.classList.add('show');
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='clientsSays'>
      <h2 ref={h2Ref}>
        <span>What do clients say about my work?</span>
        <span>What do clients say about my work?</span>
      </h2>

      <div className="images" ref={imagesRef}>
        <img src="./stikers/Group.png" alt="" />
        <img src="./stikers/Group-1.png" alt="" />
        <img src="./stikers/Group-2.png" alt="" />
        <img src="./stikers/Group-3.png" alt="" />
        <img src="./stikers/Group-4.png" alt="" />
        <img src="./stikers/Group-5.png" alt="" />
        <img src="./stikers/Group-6.png" alt="" />
        <img src="./stikers/Group-7.png" alt="" />
      </div>
    </div>
  );
}
