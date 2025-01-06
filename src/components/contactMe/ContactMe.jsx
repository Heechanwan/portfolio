import React, { useEffect, useRef, useState } from 'react';
import './ContactMe.css';

export default function ContactMe() {
  const contactMeRef = useRef(null);
  const figureRef = useRef(null);
  const bubbleRef = useRef(null);
  const f1Ref = useRef(null);
  const f2Ref = useRef(null);
  const textRef = useRef(null);
  const innerRef = useRef(null);
  const paperCraftRef = useRef(null);

  const [animationTriggered, setAnimationTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (animationTriggered) return;

      const contactMe = contactMeRef.current;
      const figure = figureRef.current;
      const bubble = bubbleRef.current;
      const text = textRef.current;
      const inner = innerRef.current;
      const paperCraft = paperCraftRef.current;
      const contactMeTop = contactMe.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const contactMeHeight = contactMe.offsetHeight;
      const threshold = contactMeHeight * 0.7;

      if (contactMeTop <= windowHeight - threshold) {
        setAnimationTriggered(true); // Запрещаем повторное выполнение анимации

        figure.classList.add('show');

        setTimeout(() => {
          bubble.classList.add('show');

          // Чередование видимости изображений f1 и f2
          const f1 = f1Ref.current;
          const f2 = f2Ref.current;
          let toggle = false;

          const intervalId = setInterval(() => {
            toggle = !toggle;
            f1.style.display = toggle ? 'none' : 'block';
            f2.style.display = toggle ? 'block' : 'none';
          }, 100);

          setTimeout(() => {
            clearInterval(intervalId);
            f1.style.display = 'none';
            f2.style.display = 'block';
          }, 1200);
        }, 1000);

        setTimeout(() => {
          text.classList.add('show');

          setTimeout(() => {
            inner.classList.add('show');
            paperCraft.classList.add('show');

            setTimeout(() => {
              bubble.classList.remove('show');
              setTimeout(() => {
                figure.classList.remove('show');
              }, 500);
            }, 1200);
          }, 1500);
        }, 1500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animationTriggered]);

  return (
    <div className='contactMe' ref={contactMeRef}>
      <div className="fakeForm">
        <div className="grid-2">
          <input type="text" placeholder='name'/>
          <input type="text" placeholder='email'/>
        </div>
        <button>contact me</button>
      </div>

      <div className="figure" ref={figureRef}>
        <img className='figure f1' ref={f1Ref} src="/public/figure_1.png" alt="" />
        <img className='figure f2' ref={f2Ref} src="/public/figure_2.png" alt="" />

        <div className='bubbleBlock' ref={bubbleRef}>
          <img className='bubble' src="/public/bubble.png" alt="" />
          <p ref={textRef}>
            <span>LET’S DO IT MORE SIMPLE!</span>
            <span>LET’S DO IT MORE SIMPLE!</span>
          </p>
        </div>
      </div>

      <div className="mainForm">
        <div className="inner" ref={innerRef}>
            <div className="fbg">
            <img className='b_1' src="/public/footer/Vector.png" alt="" />
            <img className='b_2' src="/public/footer/Vector-1.png" alt="" />
            </div>
            <div className="info">
                <h2>DO IT MORE SIMPLE</h2>
                <div className="blocks">
                    <div className="social">
                        <a href="">Telegram</a>
                    </div>
                    <div className="social">
                        <a href="">WhatsApp</a>
                    </div>
                    <div className="social">
                        <a href="">GMAIL</a>
                    </div>
                </div>
            </div>
        </div>
        <div className="paperCraft" ref={paperCraftRef}>
            <img src="/public/PaperCraft.png" alt="" />
        </div>
      </div>
    </div>
  );
}
