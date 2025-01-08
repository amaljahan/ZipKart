const express = require('express');
const router = express.Router(); 
const { view_users, block_unblock, search_user } = require('../../controller/adminController/usersController');

//view users
router.get('/view-users',view_users)
//search 
router.get('/view-users/search-user',search_user)


//BLOCK unblock
router.post('/block-unblock',block_unblock)


module.exports = router;