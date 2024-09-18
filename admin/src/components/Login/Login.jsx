import React, { useState } from "react";
import './Login.css'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { url } from "../../utils/constant";
import axios from "axios";
import { setAdmin } from "../../Redux/adminSlice";

function Login(){
    const [currState,setCurrState]=useState("Login")
    const [data,setData]=useState({
        name:"",
        email:"",
        password:""
    })
    const {admin,token}=useSelector(store=>store.auth)
    const navigate=useNavigate()
    const dispatch=useDispatch()

    const onChangeHandler=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        setData(prevData=>({...data,[name]:value}))
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            let newUrl=url;
            if(currState==="Login"){
                newUrl+="/admin/login"
                console.log(newUrl);
            }else{
                newUrl+="/admin/signup"
                console.log(newUrl);
            }
            const res = await axios.post(newUrl, data);
            if (res.data.success) {
                const { admin, token } = res.data;
                localStorage.setItem("token",token)
                dispatch(setAdmin({ admin, token }));                
                navigate("/");
                // toast.success(res.data.message);
            }
            else{
            console.log("hello");
            }
        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message);
        }
    }
    return (
        <div className="login-background-container">
            <form onSubmit={submitHandler} className="form-container">
            <h1 className="title">Admin {currState}</h1>
                {currState==="Login"?<></>:<div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="name" onChange={onChangeHandler} value={data.name} id="username" placeholder="Username" />
                </div>}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" onChange={onChangeHandler} value={data.email} id="email" placeholder="Email"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" onChange={onChangeHandler} value={data.password} id="password" placeholder="Password" />
                </div>
                <button type="submit" className="btn">{currState==="Sign Up"?"Create Account":"Login"}</button>
                {currState==="Login"?<p className="signup">
                    Don't have an account? <Link onClick={()=>setCurrState("Sign Up")} to="/signup">Sign Up</Link>
                </p>:<p className="toggle-link">Already have an account? <Link onClick={()=>setCurrState("Login")} to="/login">Login</Link></p>}
                
            </form>
        </div>
    )
}
export default Login