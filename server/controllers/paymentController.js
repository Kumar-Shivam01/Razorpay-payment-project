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

