import React from "react";
import {Link,NavLink} from 'react-router-dom'
import './Header.css'
function Header(){
    return (
        <div className="header">
            <div className="header-contents">
                <h4>CLOTHES FOR BROS</h4>
                <h1>OUR BIGGEST</h1>
                <h2>SALE YET</h2>
                <p>DISCOUNT UPTO 40%</p>
                <Link to="#">Shop Now</Link>
            </div>
        </div>
    )
}

export default Header