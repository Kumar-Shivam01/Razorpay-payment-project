import axios from 'axios'

const API = axios.create({
    baseURL: 'https://razorpay-payment-project.onrender.com/api/v1' || 'http://localhost:3001/api/v1'
})

export default API;