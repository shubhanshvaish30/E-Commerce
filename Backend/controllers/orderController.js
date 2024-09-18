import Order from '../models/Order.js';
import User from '../models/User.js';

const createOrder=async(req,res)=>{
    try {
        const { shippingAddress, orderItems, paymentInfo, totalPrice,userId } = req.body;
        const order = new Order({
            shippingAddress,
            orderItems,
            userId: req.body.userId,
            paymentInfo,
            totalPrice,
            paidAt: Date.now(),
        });
        const savedOrder = await order.save();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Filter out the items that were ordered
        user.cart = user.cart.filter(cartItem =>
            !orderItems.some(orderItem => orderItem.product.toString() === cartItem.product.toString())
        );

        // Save the updated user
        await user.save();
        res.json({
            success: true,
            order: savedOrder,
        });
    } catch (error) {
        console.error('Order creation failed:', error);
        res.json({ success: false, message: 'Order creation failed' });
    }
}

const getOrders=async (req, res) => {
    try {
        // Find the user by ID and populate the orders
        const orders = await Order.find({userId:req.body.userId}).populate({
            path: 'orderItems.product',
            select: 'name price img',
        });

        if (!orders || orders.length === 0) {
            return res.json({ success: true, orders: [] });
        }

        // Respond with the user's orders
        res.json({ success: true, orders });
    } catch (e) {
        console.log(e);
        res.json({ success: false, error: e.message });
    }
};

const orderData=async(req,res)=>{
    try {
        const orders=await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Sort by date
        ]);

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};
const orderSales=async(req,res)=>{
    try {
        const totalSales = await Order.aggregate([{ $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }]);
        res.json({ totalSales: totalSales[0].totalSales });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

const totalOrders=async(req,res)=>{
    try {
        const totalOrders = await Order.countDocuments({});
        res.json({ totalOrders });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

const getAllOrders = async (req, res) => {
    try {
        // const user=await User.find(req.body.userId)        
        const orders = await Order.find().populate('userId', 'name').populate('orderItems.product', 'name price img');
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    const { id, status } = req.body; // Get order ID and new status from the request

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        if (status === 'Dispatched' || status === 'Delivered') {
            order.orderStatus = status;

            // If the status is 'Delivered', record the delivery time
            if (status === 'Delivered') {
                order.deliveredAt = Date.now();
            }

            await order.save(); // Save the updated order

            return res.status(200).json({
                success: true,
                message: `Order status updated to ${status}`,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid status update"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });
    }
};

export { updateOrderStatus,createOrder,getOrders,orderData,orderSales,totalOrders,getAllOrders};