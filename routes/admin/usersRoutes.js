const express = require('express');
const router = express.Router(); 
const { view_users, block_unblock } = require('../../controller/adminController/usersController');

//view users
router.get('/view-users',view_users)

//BLOCK unblock
router.post('/block-unblock',block_unblock)


module.exports = router;