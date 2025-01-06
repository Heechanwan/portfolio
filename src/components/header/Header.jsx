import './Header.css'

export default function Header() {
  return (
    <header>
        
        <div className="container">
            <div className="leftSide">
                <div className="bgPaper">
                    <img className='paperBg' src="/BG_paper.svg" alt="" />
                </div>
                <h2>
                    <div>
                        <span>Work smarter</span>
                    </div>
                </h2>
                <span>Not harder</span>
            </div>
            <div className="rightSide">
                <div className="floatText">
                    <h1>
                        <span className='mainText'>HELLO THERE! I'M ANWAR</span>
                        <span className='secondaryText'>FRONT-END DEVELOPER</span>
                        <span className='secondaryText'>FRONT-END DEVELOPER</span>
                        <span className='secondaryText'>FRONT-END DEVELOPER</span>
                        <span className='secondaryText'>FRONT-END DEVELOPER</span>
                        <span className='secondaryText'>FRONT-END DEVELOPER</span>
                    </h1>
                </div>

                <div className="imgBlock">
                    <img className='mainImg' src="/public/Palaroid.png" alt="" />
                    <img className="star" src="/public/Star.png" alt="" />
                    <img className="spray" src="/public/spray.png" alt="" />
                    <img className='plate plate_1' src="/public/plate.png" alt="" />
                    <img className='plate plate_2' src="/public/plate.png" alt="" />
                </div>

                {/* <div className="contactMe">
                    <span>contact me</span>
                    <img className='buttonBg white' src="/public/ButtonMain_white.png" alt="" />
                    <img className='buttonBg pink' src="/public/ButtonMain.png" alt="" />
                </div> */}
            </div>
        </div>

    </header>
  )
}
