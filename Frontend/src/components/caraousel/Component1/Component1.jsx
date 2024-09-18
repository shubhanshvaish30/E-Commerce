import React from "react";
import { Link } from "react-router-dom";
import './Component1.css'
function Component1(){
    return (
        <div className="component1-header">
            <div className="component1-contents">
                <Link to="#">Shop Now</Link>
            </div>
        </div>
    )
}

export default Component1