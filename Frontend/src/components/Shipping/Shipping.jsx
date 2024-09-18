import React, { useState } from "react";
import './Shipping.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { url } from "../../utils/constant";
import { toast } from "react-toastify";

function Shipping() {
    const { shippingInfo } = useSelector(store => store.shipping);
    const { token } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [newAddress, setNewAddress] = useState({
        address: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',
        phoneNo: ''
    });
    const handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setNewAddress(prevData => ({ ...prevData, [name]: value }));
    };
    const submitAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${url}/auth/address`, newAddress, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.data.success) {
                toast.success(res.data.msg);
                navigate('/place');
            } else {
                toast.error("Failed to save address");
            }
        } catch (e) {
            console.error("Error saving address", e);
        }
    };

    return (
        <div className="shipping">
            <form onSubmit={submitAddress} className="shipping-form">
                <h2>Shipping Information :</h2>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input 
                        name="address" 
                        id="address" 
                        placeholder="Address" 
                        onChange={handleInputChange} 
                        value={newAddress.address} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City:</label>
                    <input 
                        name="city" 
                        id="city" 
                        placeholder="City" 
                        onChange={handleInputChange} 
                        value={newAddress.city} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="state">State:</label>
                    <input 
                        name="state" 
                        id="state" 
                        placeholder="State" 
                        onChange={handleInputChange} 
                        value={newAddress.state} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="country">Country:</label>
                    <input 
                        name="country" 
                        id="country" 
                        placeholder="Country" 
                        onChange={handleInputChange} 
                        value={newAddress.country} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="pinCode">Pin Code:</label>
                    <input 
                        name="pinCode" 
                        id="pinCode" 
                        placeholder="Pin Code" 
                        onChange={handleInputChange} 
                        value={newAddress.pinCode} 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNo">Phone Number:</label>
                    <input 
                        name="phoneNo" 
                        id="phoneNo" 
                        placeholder="Phone Number" 
                        onChange={handleInputChange} 
                        value={newAddress.phoneNo} 
                    />
                </div>
                <button type="submit" className="btn-save">Save Address</button>
            </form>
        </div>
    );
}

export default Shipping;
