const express = require('express')
const router = express.Router();
const {createOrder} = require('../controllers/paymentController')

router.route('/create-order').post(createOrder);

module.exports = router;  