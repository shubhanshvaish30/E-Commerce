    import React from 'react';
    import { useDispatch, useSelector } from 'react-redux';
    import { useNavigate } from 'react-router-dom';
    import './Confirmation.css';
    import { assets } from '../../assets/assets';
    import { setCart } from '../../Redux/cartSlice';
    import { url } from '../../utils/constant';
    import OrderBar from '../OrderBar/OrderBar';
    import { loadStripe } from '@stripe/stripe-js';
    import { STRIPE_PUBLIC_KEY } from '../../utils/constant';
    import { toast } from "react-toastify";
    import axios from 'axios';
import {setOrderItems} from '../../Redux/shippingSlice';
    const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

    function Confirmation() {
        const { shippingInfo, orderItems, totalPrice } = useSelector(state => state.shipping);
        const {user,token}=useSelector(store=>store.auth)
        const navigate = useNavigate();
        const dispatch=useDispatch()
        const {totalQuantity}=useSelector(store=>store.cart)
        const orderData=orderItems.orderItems;
        const handleProceed = async () => {
            dispatch(setOrderItems({orderItems:orderData}))
            console.log(orderItems.orderItems);
            
            navigate('/payment')
        };
    
        return (
            <div>
                <OrderBar currentStep={2}/>
                <div className="confirmation-container">
                    <h2>Order Confirmation</h2>
                    <div className="confirmation-section">
                        <h3>Shipping Information:</h3>
                        <p>{user.name}</p>
                        <p>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}, {shippingInfo.country}</p>
                        <p>Pin Code: {shippingInfo.pinCode}</p>
                        <p>Phone Number: {shippingInfo.phoneNo}</p>
                    </div>
                    <div className="confirmation-section">
                        <h3>Order Items:</h3>
                        {orderData.length > 0 ? (
                        <>
                            <div className="cart-items">
                                {orderData.map((item) => (
                                    <div className="cart-item" key={item.product._id}>
                                        <img src={`${url}/images/${item.product.img}`} alt={item.product.name} />
                                        <div className="item-details">
                                            <h2>{item.product.name}</h2>
                                            <p>Price: ₹{item.product.price}</p>
                                            <div className="quantity-controls">
                                                <p>Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="cart-summary">
                                <div className="summary-details">
                                    <span>Total Quantity:</span>
                                    <span>{totalQuantity}</span>
                                </div>
                                <div className="summary-details">
                                    <span>Total Price:</span>
                                    <span>₹{totalPrice.totalPrice}</span>
                                </div>
                            </div>
                        </>
                        ): (
                        <div className="empty-cart">
                            <img src={assets.logo} alt="Empty Cart" />
                            <p>Your cart is empty.</p>
                        </div>
                        )}
                    <div className="confirmation-button">
                        <button className="proceed-btn" onClick={handleProceed}>Place Order</button>
                    </div>
                </div>
            </div>
        </div>
    )
    }

    export default Confirmation;
