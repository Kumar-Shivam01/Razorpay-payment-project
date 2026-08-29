const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    razorpayOrderId:{
        type: String,
        required: true,
        unique: true
    },
    amount:{
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['created','paid','failed'],
        default:'created'
    },
    paymentId:{
        type: String,
        unique: true
    }   
})
module.exports = mongoose.model('Order',orderSchema);