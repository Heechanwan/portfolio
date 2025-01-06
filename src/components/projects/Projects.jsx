import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Card from './card/Card';
import Eye from './eye/Eye';
import './Projects.css';

export default function Projects() {
  const [data, setData] = useState([
    {
      "title": "AI QUEST",
      "purpleData": "WORDPRESS",
      "yellowData": "DEVELOPMENT",
      "link": "https://ai-quest.co.uk/"
    },
    {
      "title": "GOOD GRADE",
      "purpleData": "WORDPRESS",
      "yellowData": "DEVELOPMENT",
      "link": "https://goodgradeschool.uz/"
    },
    {
      "title": "KLM",
      "purpleData": "WORDPRESS",
      "yellowData": "DEVELOPMENT",
      "link": "https://kavanahlmitzvos.com/"
    },
    {
      "title": "Chomesh L'Chinuch",
      "purpleData": "WORDPRESS",
      "yellowData": "DEVELOPMENT",
      "link": "https://chinuch20.org/"
    },
    {
      "title": "CoolHeat",
      "purpleData": "Webflow",
      "yellowData": "DEVELOPMENT",
      "link": "https://coolheat.webflow.io/"
    },
  ]);

  const sliderRef = useRef(null);
  const timeline = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const totalWidth = slider.scrollWidth / 2;
    const duration = 20; // Adjust this value for speed

    // Создаем таймлайн с GSAP
    timeline.current = gsap.timeline({ repeat: -1, defaults: { ease: 'linear' } })
      .fromTo(slider, { x: 0 }, { x: -totalWidth, duration: duration, modifiers: {
        x: gsap.utils.unitize(value => parseFloat(value) % totalWidth)
      } });

    return () => {
      timeline.current.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeline.current) timeline.current.timeScale(0.00001);
  };

  const handleMouseLeave = () => {
    if (timeline.current) timeline.current.timeScale(0.5);
  };

  return (
    <div className='projects'>
      <div className="title">
        <h2><span> Let's L<span className='fakeOo'>OO</span> <span className='eyeSpan'><Eye /></span> <span className='eyeSpan'><Eye /></span>K at my Projects</span></h2>
      </div>

      <div className="cards">
        <div className="slider" ref={sliderRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {[...data, ...data].map((el, index) => (
            <Card key={index} title={el.title} purpleData={el.purpleData} yellowData={el.yellowData} link={el.link} />
          ))}
        </div>
        <div className="bg">
          <img className='bgGray' src="./BG_paper_gray.png" alt="" />
          <img className='bgYellow' src="./BG_paper_yellow.png" alt="" />
        </div>
      </div>
    </div>
  );
}
