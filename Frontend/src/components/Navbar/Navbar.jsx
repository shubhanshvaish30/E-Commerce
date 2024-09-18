import React, { useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import './Navbar.css'
import { assets } from "../../assets/assets"
import { useDispatch, useSelector } from "react-redux"
import { url } from "../../utils/constant"
import axios from "axios"
import { clearAuth } from "../../Redux/authSlice"
import { setCategory } from "../../Redux/productSlice"
import { toast } from "react-toastify"


function Navbar({setShowLogin}){
  const { token, user } = useSelector(store => store.auth);
  const {totalQuantity}=useSelector(store=>store.cart);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {category}=useSelector(store=>store.product)
  const handleCategoryClick = (itemCateg) => {
    const newCategory = category === itemCateg ? "All" : itemCateg;
    dispatch(setCategory(newCategory));
    navigate(`/${newCategory.toLowerCase()}`);
  };
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    const newUrl=url+"/auth/logout";
    try {
      const res=await axios.post(newUrl);
      localStorage.removeItem("token");
      dispatch(clearAuth());
      navigate("/login");
      toast.success(res.data.msg);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };
    return (
        <nav className="navbar">
      <div className="container">
        <div className="left-section">
          <div className="links">
            <img src={assets.logo} alt="E-Bazaar Logo" className="logo" />
            <Link to="/">E-Bazaar</Link>
          </div>
          <div className="ele">
            <div className="hover-underline-animation">
              <NavLink to="/" role="button">Home</NavLink>
            </div>
            <div className="dropdown hover-underline-animation">
              <NavLink to="#" role="button" className="dropbtn">Categories</NavLink>
              <div className="dropdown-content">
              <Link to="/mens" onClick={() => handleCategoryClick('Mens')}>Mens</Link>
                <Link to="/womens" onClick={() => handleCategoryClick('Womens')}>Womens</Link>
                <Link to="/kids" onClick={() => handleCategoryClick('Kids')}>Kids</Link>
                <Link to="/footwears" onClick={() => handleCategoryClick('Footwears')}>Footwears</Link>
                <Link to="/beauty" onClick={() => handleCategoryClick('Beauty')}>Beauty</Link>
              </div>
            </div>
            <div className="hover-underline-animation">
              <NavLink to="#" role="button">About</NavLink>
            </div>
          </div>
          <form className="search-form">
            <input type="text" 
            placeholder="Search..." 
            name="search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><i className="fas fa-search"></i></button>
          </form>
        </div>
        <div className="profile">
          <NavLink to="#" className="nav-link loc"><i className="fas fa-map-marker-alt"></i></NavLink>
          <NavLink to="/cart" className="nav-link cart">
            <i className="fas fa-cart-plus"></i>
            <sup><span className="badge bg-danger cart-badge">{totalQuantity}</span></sup>
          </NavLink>
          {user && (
            <NavLink to="#" className="nav-link">Hello, {user.name}</NavLink>
          )}
          {!token ? (
                <Link to="/login" className="login" onClick={()=>{setShowLogin(true)}}>Login</Link>
              ) : (
                <Link className="login" onClick={handleLogout}>Logout</Link>
            )}
          <div className="dropdown">
            <NavLink to="#" className="nav-link dropbtn"><i className="fas fa-user"></i></NavLink>
            <div className="dropdown-contentp">
              <Link to="#">View Profile</Link>
              <Link to="#">Settings</Link>
              <Link to="/orders">Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    )
}

export default Navbar