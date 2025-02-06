const express = require('express');
const { get_wallet, add_money_to_wallet, verify_payment_of_wallet } = require('../../../controller/user/accountDetails/wallet_controller');
const router = express.Router()


router.get('/wallet',get_wallet)
router.post('/wallet/add-money',add_money_to_wallet)
router.post('/wallet/add-money/verify-payment',verify_payment_of_wallet)


module.exports = router;
