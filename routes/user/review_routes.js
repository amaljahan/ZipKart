const express = require('express')
const { review_rating } = require('../../controller/user/review_controller');
const { isUser } = require('../../middleware/user/userAuthMiddleware');
const router = express.Router()


router.post('/submit-review',review_rating)


module.exports = router;
