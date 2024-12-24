const express = require('express');
const { get_dashboard } = require('../../controller/adminController/dashboardController');
const router = express.Router(); 

//dashboard
router.get('/dashboard',get_dashboard)



module.exports = router;