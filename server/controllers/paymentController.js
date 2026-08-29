const crypto = require('crypto')
const razorpay = require('../config/razorpay')
const Order = require('../models/Order')

exports.createOrder = async (req,res)=>{
    try{
        const {amount,currency='INR'} = req.body;
        const razorpayOrder = await razorpay.orders.create({
            amount: amount*100,
            currency,
            receipt: `receipt_order_${Date.now()}`
        })  
        const order = await Order.create({  
            razorpayOrderId: razorpayOrder.id,
            amount,
            currency,
            status: 'created'
        })
        res.status(200).json({
            status: 'success',
            message: 'Order created successfully',
            razorpayOrder,
            orderId: order._id
        })
    }catch(err){
        return res.status(500).json({status:'failed',message:'Failed to create order',error:err.message})
    }
}

// client-side signature check, backup verification
exports.verifyPayment = async(req,res)=>{
    try{
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex')
        if (expectedSignature === razorpay_signature) {
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'paid', paymentId: razorpay_payment_id }
            );
            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'failed' }
            );
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    }catch(err){
        return res.status(500).json({status:'failed',message:'Failed to verify payment',error:err.message})
    }
}