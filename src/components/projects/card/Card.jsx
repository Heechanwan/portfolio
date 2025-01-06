import Eye from "../eye/Eye";
import './Card.css'

export default function Card({title, purpleData, yellowData, link}) {
  return (
    <div className="projectCard">
        <div className="leftSide">
            <a href={link} target="_blank"></a>
            <div className="eye e1">
              <Eye/>
            </div>
            <div className="eye e2">
              <Eye/>
            </div>
            <div className="eye e3">
              <Eye/>
            </div>
            <div className="eye e4">
              <Eye/>
            </div>
            <div className="eye e5">
              <Eye/>
            </div>
            <div className="eye e6">
              <Eye/>
            </div>
        </div>
        <div className="rightSide">
           <div className="inner">
             <h3 className="title">{title}</h3>
             <div className="info">
               <span className="purpleData">{purpleData}</span>
               <span className="yellowData">{yellowData}</span>
             </div>
           </div>
            <div className="back">
                <img className="wlaster" src="/public/Wlaster.png" alt="" />
            </div>
        </div>
    </div>
  )
}
