import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Orders.css';

function Orders({ url }) {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filter, setFilter] = useState('All'); // Default filter

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${url}/order/getAll`);
            if (response.data.success) {
                setOrders(response.data.orders);
                filterOrders(response.data.orders, filter); // Apply filter after fetching
            } else {
                toast.error("Failed to fetch orders");
            }
        } catch (error) {
            toast.error("Error fetching orders");
            console.error(error);
        }
    };

    const filterOrders = (orders, filter) => {
        if (filter === 'All') {
            setFilteredOrders(orders);
        } else if (filter === 'Yet to Dispatched') {
            setFilteredOrders(orders.filter(order => order.orderStatus === 'Processing'));
        } else if (filter === 'Yet to Delivered') {
            setFilteredOrders(orders.filter(order => order.orderStatus === 'Dispatched'));
        }
    };

    const updateOrderStatus = async (orderId, currentStatus) => {
        let newStatus;
        if (currentStatus === 'Processing') {
            newStatus = 'Dispatched';
        } else if (currentStatus === 'Dispatched') {
            newStatus = 'Delivered';
        } else {
            toast.error("Invalid status transition");
            return;
        }

        try {
            const response = await axios.post(`${url}/order/update`, { id: orderId, status: newStatus });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchOrders(); // Refresh the orders list
            } else {
                toast.error("Failed to update order status");
            }
        } catch (error) {
            toast.error("Error updating order status");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders(orders, filter);
    }, [filter, orders]);

    return (
        <div className="orders-container">
            <h2>All Orders</h2>
            <div className="filter-buttons">
                <button onClick={() => setFilter('All')} className={`filter-btn ${filter === 'All' ? 'active' : ''}`}>All</button>
                <button onClick={() => setFilter('Yet to Dispatched')} className={`filter-btn ${filter === 'Yet to Dispatched' ? 'active' : ''}`}>Yet to Dispatched</button>
                <button onClick={() => setFilter('Yet to Delivered')} className={`filter-btn ${filter === 'Yet to Delivered' ? 'active' : ''}`}>Yet to Delivered</button>
            </div>
            {filteredOrders.map((order, index) => (
                <div key={index} className="order-card">
                    <div className="order-details">
                        <p><b>Order ID:</b> {order._id}</p>
                        <p><b>Customer Name:</b> {order.userId.name}</p>
                        <p><b>Transaction ID:</b> {order.paymentInfo.id}</p>
                        <p><b>Payment Status:</b> {order.paymentInfo.status.toUpperCase()}</p>
                        <p><b>Order Status:</b> {order.orderStatus.toUpperCase()}</p>
                        {order.orderStatus !== 'Delivered' && (
                            <button 
                                onClick={() => updateOrderStatus(order._id, order.orderStatus)} 
                                className="status-btn">
                                {order.orderStatus === 'Processing' ? 'Dispatch' : 'Mark as Delivered'}
                            </button>
                        )}
                    </div>

                    <div className="order-products">
                        <h4>Order Items:</h4>
                        {order.orderItems.map((item, i) => (
                            <div key={i} className="order-item">
                                <img src={`${url}/images/${item.product.img}`} alt={item.product.name} className="product-image" />
                                <div className="product-info">
                                    <p><b>Name:</b> {item.product.name}</p>
                                    <p><b>Price:</b> Rs. {item.product.price}</p>
                                    <p><b>Quantity:</b> {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Orders;
