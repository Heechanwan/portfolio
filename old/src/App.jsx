import React from 'react';
import Marquee from './components/marquee/Marquee';
import './App.css';
import Header from './components/header/Header';
import Star from './components/svg/star/Star';
import Projects from './components/projects/Projects';
import ClientsSays from './components/clientsSays/ClientsSays';
import ContactMe from './components/contactMe/ContactMe';

function App() {
  return (
    <div className="app">
      <div className="mainInner">
        <div className="overlay"></div>
        <div className="page">
          <Header />
          <Marquee>
            <span>HTML</span>
            <span><Star /></span>
            <span>CSS</span>
            <span><Star /></span>
            <span>JS</span>
            <span><Star /></span>
            <span>JQUERY</span>
            <span><Star /></span>
            <span>SASS</span>
            <span><Star /></span>
            <span>SCSS</span>
            <span><Star /></span>
            <span>NODE JS</span>
            <span><Star /></span>
            <span>NPM</span>
            <span><Star /></span>
            <span>REACT JS</span>
            <span><Star /></span>
            <span>REDUX</span>
            <span><Star /></span>
            <span>ZUSTAND</span>
            <span><Star /></span>
            <span>WORDPRESS</span>
            <span><Star /></span>
            <span>WEBFLOW</span>
            <span><Star /></span>
            <span>WIX</span>
            <span><Star /></span>
            <span>FIGMA</span>
            <span><Star /></span>
            <span>PHOTOSHOP</span>
            <span><Star /></span>
            <span>ILLUSTRATOR</span>
            <span><Star /></span>
          </Marquee>
          <Projects/>
          <ClientsSays/>
          <ContactMe/>
        </div>
        <div className="joke">
            <h2>Please use a normal device, not a calculator :D</h2>
        </div>
        <div className="ver">
          0.8b
        </div>
      </div>
    </div>
  );
}

export default App;
