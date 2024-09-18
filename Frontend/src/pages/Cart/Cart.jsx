import React, { useEffect } from "react";
import './Cart.css';
import { setCart } from "../../Redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { url } from "../../utils/constant";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { setCheckOut, setOrderItems,setTotalPrice } from "../../Redux/shippingSlice";

function Cart() {
    const {token}=useSelector(store => store.auth);
    const {items,grandTotal,totalQuantity}=useSelector(store => store.cart);
    const {isCheckOut}=useSelector(store=>store.shipping)
    const dispatch=useDispatch();
    const navigate=useNavigate();
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
                dispatch(setCart({
                    items: [],
                    grandTotal: 0,
                    totalQuantity: 0,
                }));
                console.log("Failed to fetch products:", response.data.message);
            }
        }catch(error){
            console.log(error);
        }
    };
    const updateQuantity=async(itemId,change)=>{
        try {
            const response=await axios.post(`${url}/cart/update`, {
                itemId,
                quantityChange: change
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Update Quantity Response:', response.data);
            if(response.data.success){
                fetchCart()
            } else {
                console.log("Failed to update quantity:", response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const checkOut=()=>{
        dispatch(setOrderItems({
            orderItems:items,
        }))
        dispatch(setTotalPrice({totalPrice:grandTotal}))
        dispatch(setCheckOut(true))
        navigate('/place')
    }
    useEffect(() => {
        if (token) {
            fetchCart();
        }
        else{
            dispatch(setCart({
                items: [],
                grandTotal: 0,
                totalQuantity: 0,
            }));
        }
    }, [token]);

    
    return (
        <div className="cart-container">
            <h1>Your Shopping Cart</h1>
            {items.length > 0 ? (
                <>
                    <div className="cart-items">
                        {items.map((item) => (
                            <div className="cart-item" key={item.product._id}>
                                <img src={`${url}/images/${item.product.img}`} alt={item.product.name} />
                                {console.log(item)}
                                <div className="item-details">
                                    <h2>{item.product.name}</h2>
                                    <p>Price: ₹{item.product.price}</p>
                                    <div className="quantity-controls">
                                        <p>Quantity: </p>
                                        <button
                                            className="decrement-btn"
                                            onClick={() => updateQuantity(item.product._id, -1)}
                                        >
                                            -
                                        </button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button
                                            className="increment-btn"
                                            onClick={() => updateQuantity(item.product._id, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Grand Total</h2>
                        <div className="summary-details">
                            <span>Total Quantity:</span>
                            <span>{totalQuantity}</span>
                        </div>
                        <div className="summary-details">
                            <span>Total Price:</span>
                            <span>₹{grandTotal}</span>
                        </div>
                        <div className="checkout-button-container">
                            <button onClick={checkOut} className="checkout-btn">
                                <i className="fas fa-shopping-cart"></i> Checkout
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="empty-cart">
                    <img src={assets.logo} alt="Empty Cart" />
                    <p>Your cart is empty.</p>
                </div>
            )}
        </div>
    );
}

export default Cart;
