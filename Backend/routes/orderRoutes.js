import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { createOrder, getAllOrders, getOrders, orderData, orderSales, totalOrders, updateOrderStatus } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/create', authMiddleware,createOrder);
// orderRouter.put('/order/:orderId/update', updateOrderStatus);
orderRouter.get('/get',authMiddleware, getOrders);
orderRouter.get('/orders-per-day',orderData);
orderRouter.get('/total-sales',orderSales);
orderRouter.get('/total-orders',totalOrders);
orderRouter.get('/getAll',getAllOrders)
orderRouter.post('/update',updateOrderStatus)

export default orderRouter;
