import React from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import './Navbar.css'
import { assets } from "../../assets/assets"
import { useDispatch, useSelector } from "react-redux"
import { url } from "../../utils/constant"
import axios from "axios"
import { clearAuth } from "../../Redux/adminSlice"

function Navbar({setShowLogin,cartQuantity}){
  const {admin,token} = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const newUrl=url+"/auth/logout";
    try {
      await axios.post(newUrl);
      localStorage.removeItem("token");
      dispatch(clearAuth());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
    return (
        <nav className="navbar">
      <div className="container">
        <div className="left-section">
          <div className="links">
            <img src={assets.logo} alt="E-Bazaar Logo" className="logo" />
            <Link to="/">E-Bazaar</Link>
            <p> (Admin Panel)</p>
          </div>
          <div className="ele">
          </div>
          <form className="search-form" action="#" method="GET">
            <input type="text" placeholder="Search..." name="search" />
            <button type="submit"><i className="fas fa-search"></i></button>
          </form>
        </div>
        <div className="profile">
          {token && (
            <NavLink to="#" className="nav-link">Hello, {admin.name}</NavLink>
          )}
          {!token ? (
                <Link to="/login" className="login" onClick={()=>{setShowLogin(true)}}>Login</Link>
              ) : (
                <Link to="/logout" className="login" onClick={handleLogout}>Logout</Link>
            )}
          <div className="dropdown">
            <NavLink to="#" className="nav-link dropbtn"><i className="fas fa-user"></i></NavLink>
            <div className="dropdown-contentp">
              <Link to="#">View Profile</Link>
              <Link to="#">Settings</Link>
              <Link to="#">Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    )
}

export default Navbar