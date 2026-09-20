const express = require('express');
const mongoose = require('mongoose');
const paymentRoutes = require('./routes/paymentRoutes')
const dotenv = require('dotenv').config();
const cors = require('cors')
const port = 3001;
const app = express();
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'https://razorpay-payment-project.vercel.app'
        ];
        if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}))
mongoose.connect(process.env.MONGODB_CONN_STR)

app.use(express.json());

app.get('/',(req,res)=>{
    res.send(`Hello from server ${process.env.NAME}`)
})
app.use('/api/v1/payment',paymentRoutes)

const connectServer = async()=>{
    try{
         await mongoose.connect(process.env.MONGODB_CONN_STR)
         console.log('DB connection successfull!')
         app.listen(port,()=>{
            console.log(`Server running at http://localhost:${port}`)
         })
    }catch(err){
        console.log(`DB connection failed: ${err}`)
    }
}

connectServer()
