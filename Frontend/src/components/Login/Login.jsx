import React, { useState } from "react";
import './Login.css'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { url } from "../../utils/constant";
import axios from "axios";
import { setUser } from "../../Redux/authSlice";
import { toast } from "react-toastify";

function Login(){
    const [currState,setCurrState]=useState("Login")
    const [data,setData]=useState({
        name:"",
        email:"",
        password:""
    })
    const {user,token}=useSelector(store=>store.auth)
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
            let newUrl = url;
            let emailType = "";

            if (currState === "Login") {
                newUrl += "/auth/login";
                emailType = ""; // No email for login
            } else {
                newUrl += "/auth/signup";
                emailType = "signup"; // Email type for signup
            }

            const res = await axios.post(newUrl, data);
            console.log(res);
            
            if (res.data.success) {
                const { user, token } = res.data;
                localStorage.setItem("token", token);
                dispatch(setUser({ user, token }));
                toast.success(res.data.msg);
                navigate("/");

                if (emailType === "signup") {
                    const mailUrl = url + '/auth/mail';
                    const mailData = {
                        email: user.email,
                        userName: user.name,
                        type: emailType,
                        details: {} // No additional details needed for signup
                    };
                    console.log("Sending email with data:", mailData);
                    const mailResponse = await axios.post(mailUrl, mailData);
                    if (mailResponse.data.success) {
                        console.log("Mail sent response:", mailResponse.data);
                        toast.success(mailResponse.data.msg);
                    }
                }
            } else {
                console.log("Login or signup failed");
                toast.error("Invalid Credentials!")
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred. Please try again.");
        }
    };
    return (
        <div className="background-container">
            <form onSubmit={submitHandler} className="form-container">
            <h1 className="title">{currState}</h1>
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