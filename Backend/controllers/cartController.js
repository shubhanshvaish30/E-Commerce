import Product from "../models/Product.js";
import User from "../models/User.js";


const updateQuant = async (req, res) => {
    try {
        const {itemId,quantityChange } = req.body;
        let userData = await User.findById(req.body.userId);
        let cartData = userData.cart || [];
        let itemExists = cartData.some(item => item.product.toString() === itemId);
        if (itemExists) {
            cartData = cartData.map(item => {
                if (item.product.toString() === itemId) {
                    item.quantity += quantityChange;
                    if (item.quantity > 5) {
                        item.quantity = 5;
                    }
                    if (item.quantity <= 0) {
                        return null;
                    }
                }
                return item;
            }).filter(item => item !== null);
        } else {
            console.log("Not Found");
        }
        userData.cart = cartData;
        await userData.save();
        const grandTotal = cartData.reduce((total, item) => total + item.product.price * item.quantity, 0);
        const totalQuantity = cartData.reduce((total, item) => total + item.quantity, 0);
        
        return res.json({ success: true, message: "Added to Cart",items: cartData, grandTotal,totalQuantity});
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
};

const getCart=async(req,res)=>{
    try {
        const user = await User.findById(req.body.userId).populate({
            path: 'cart',
            populate: {
                path: 'product',
                model: 'Product',
            },
        });   
        if (!user || !user.cart.length) {
            return res.status(200).json({ items: [], grandTotal: 0, totalQuantity: 0 });
        }
        let totalQuantity = 0;
        let grandTotal = 0;
        const items = [];
        for (let item of user.cart) {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product with ID ${item.product} not found`);
            }
            const quantity = item.quantity;
            grandTotal += product.price * quantity;
            totalQuantity += quantity;
            const detailedItem = {
                product,
                quantity
            };
            items.push(detailedItem);
        }
        res.json({success:true, items, grandTotal, totalQuantity });
    } catch (e) {
        console.log(e);
        
        res.json({success:false, error: e.message });
    }
};
export {getCart,updateQuant}