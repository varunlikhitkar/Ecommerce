const express = require('express');
const { getKey, createOrder, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

router.get('/key', getKey);
router.post('/order', createOrder);
router.post('/verify', verifyPayment);

module.exports = router;
