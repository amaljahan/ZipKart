const express = require('express');
const { get_wallet, add_money_to_wallet } = require('../../../controller/user/accountDetails/wallet_controller');
const router = express.Router()


router.get('/wallet',get_wallet)
router.get('/wallet/add-money',add_money_to_wallet)
router.get('/wallet/add-money/verify-payment',add_money_to_wallet)


module.exports = router;
