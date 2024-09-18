import React from "react";
import './Sidebar.css'
import {NavLink} from 'react-router-dom'
import { assets } from "../../assets/assets";
function Sidebar(){
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to='/' className="sidebar-option">
          <img src={assets.add_prod1} alt="" />
          <p>Home</p>
        </NavLink>
        <NavLink to='/add' className="sidebar-option">
          <img src={assets.add_prod1} alt="" />
          <p>Add Products</p>
        </NavLink>
        <NavLink to='/show' className="sidebar-option">
          <img src={assets.show} alt="" />
          <p>Show Products</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
          <img src={assets.orders} alt="" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar