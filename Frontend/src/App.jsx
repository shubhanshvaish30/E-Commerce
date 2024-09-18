import React, { useEffect } from "react"
import Navbar from "./components/Navbar/Navbar"
import { Route,Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Cart from "./pages/Cart/Cart"
import Place from "./pages/PlaceOrder/Place"
import { useState } from "react"
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from "./components/Login/Login"
import Product from "./pages/Product/Product"
import Mens from "./components/ExploreComponents/Mens/Mens"
import Womens from "./components/ExploreComponents/Womens/Womens"
import Kids from "./components/ExploreComponents/Kids/Kids"
import Footwears from "./components/ExploreComponents/Footwears/Footwears"
import Beauty from "./components/ExploreComponents/Beauty/Beauty"
import SearchResults from "./pages/SearchResults/SearchResults"
import Confirmation from "./components/Confirmation/Confirmation"
import Payment from "./components/Payment/Payment"
import Shipping from "./components/Shipping/Shipping"
import { useDispatch, useSelector } from "react-redux"
import Success from "./components/Success/Success"
import axios from "axios"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { url } from "./utils/constant"
import { setCart } from "./Redux/cartSlice"
import Orders from "./components/Orders/Orders"

function App() {
  const [showLogin,setShowLogin]=useState(false)
  const dispatch=useDispatch()
  const {token}=useSelector(state=>state.auth)
  const [stripeApiKey,setStripeApiKey]=useState("")
  const fetchCart=async()=>{
    try {
        const response=await axios.get(`${url}/cart/get`,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
        });
        if(response.data.success){
            dispatch(setCart({
            items:response.data.items,
            grandTotal:response.data.grandTotal,
            totalQuantity: response.data.totalQuantity,
        }));
        }else{
            console.log("Failed to fetch products:", response.data.message);
        }
    }catch(error){
        console.log(error);
    }
};
  async function getStripeApiKey() {
    try {
      const { data } = await axios.get(`${url}/make/stripeKey`,{
        headers: {
            Authorization:`Bearer ${token}`,
        },
    });
      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      console.error('Error fetching Stripe API key:', error);
    }
  }
  useEffect(() => {
    if(token){
      fetchCart();
    }else{
      dispatch(setCart({
        items: [],
        grandTotal: 0,
        totalQuantity: 0,
    }));
    }
    getStripeApiKey()
    }, [token])

  return (
    <>
      <div className="app">
      <ToastContainer/>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route
            path="/login"
            element={<Login setShowLogin={setShowLogin} />}
          />
          <Route
            path="/signup"
            element={<Login setShowLogin={setShowLogin} />}
          />
          <Route path="/search" element={<SearchResults/>} />
          <Route path="/mens" element={<Mens/>}/>
          <Route path="/womens" element={<Womens/>}/>
          <Route path="/kids" element={<Kids/>}/>
          <Route path="/footwears" element={<Footwears/>}/>
          <Route path="/beauty" element={<Beauty/>}/>
          <Route path="/products/:id" element={<Product/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/place" element={token?<Place/>:<Login/>}/>
          <Route path="/newAddress" element={token?<Shipping />:<Login/>} />
          <Route path="/confirm" element={token?<Confirmation />:<Login/>} />
          <Route path="/payment" element={token && stripeApiKey?<Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements>:<Login/>} />
          <Route path="/success" element={token?<Success />:<Login/>} />
          <Route path="/orders" element={token?<Orders />:<Login/>} />
          {/* <Route path="/payment" element={<PaymentPage />} /> */}
        </Routes>
      </div>
    </>
  )
}

export default App
