import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Line } from 'react-chartjs-2';
import 'react-circular-progressbar/dist/styles.css';
import './Report.css';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { url } from '../../utils/constant';

// Register the necessary components for the chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Report() {
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [orderData, setOrderData] = useState([]); // Ensure it's initialized as an array

    const ordersTarget = 100;
    const salesTarget = 1000000;
    const usersTarget = 100;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch real-time data
                const ordersResponse = await axios.get(`${url}/order/total-orders`);
                const salesResponse = await axios.get(`${url}/order/total-sales`);
                const usersResponse = await axios.get(`${url}/auth/active-users`);
                const ordersPerDayResponse = await axios.get(`${url}/order/orders-per-day`);

                setTotalOrders(ordersResponse.data.totalOrders);
                setTotalSales(salesResponse.data.totalSales);
                setActiveUsers(usersResponse.data.activeUsers);
                
                if (Array.isArray(ordersPerDayResponse.data)) {
                    setOrderData(ordersPerDayResponse.data);
                } else {
                    console.error("Unexpected response format: ", ordersPerDayResponse.data);
                }

            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    if (!Array.isArray(orderData)) {
        return <div>Loading...</div>;
    }

    const chartData = {
        labels: orderData.map(order => order._id),
        datasets: [
            {
                label: 'Number of Orders per Day',
                data: orderData.map(order => order.totalOrders),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Orders',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="report-container">
            <div className="report-data">
                <div className="metric">
                    <h3>Total Orders :</h3>
                    <CircularProgressbar 
                        value={totalOrders} 
                        maxValue={ordersTarget}
                        text={`${totalOrders}/${ordersTarget}`}
                        styles={buildStyles({
                            pathColor: 'green',
                            textColor: 'black',
                            textSize: '14px',
                        })}
                    />
                </div>
                <div className="metric">
                    <h3>Total Sales (₹) :</h3>
                    <CircularProgressbar 
                        value={totalSales} 
                        maxValue={salesTarget}
                        text={`₹${totalSales}`}
                        styles={buildStyles({
                            pathColor: 'blue',
                            textColor: 'black',
                            textSize: '14px',
                        })}
                    />
                </div>
                <div className="metric">
                    <h3>Active Users :</h3>
                    <CircularProgressbar 
                        value={activeUsers} 
                        maxValue={usersTarget}
                        text={`${activeUsers}/${usersTarget}`}
                        styles={buildStyles({
                            pathColor: 'red',
                            textColor: 'black',
                            textSize: '14px',
                        })}
                    />
                </div>
            </div>

            {/* Orders Graph */}
            <div className="orders-graph">
                <h3>Orders Trend (Day by Day)</h3>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}

export default Report;
