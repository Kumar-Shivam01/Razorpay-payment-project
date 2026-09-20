const Razorpay = require('razorpay')
require('dotenv').config()
const razorpay = new Razorpay({ //make a razorpay instance
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
module.exports = razorpay