const Wallet = require('../../../model/user/wallet_model')
const Razorpay= require('razorpay')
const crypto = require('crypto')

const KeyId=process.env.KEY_ID
const SecretKey= process.env.SECRET_KEY

const razorpayInstance = new Razorpay({
    key_id: KeyId, 
    key_secret: SecretKey 
});


const get_wallet = async(req, res)=>{
    try {

        res.render('user/accountDetails/wallet',{session : req.session})
    } catch (error) {
        console.log("Error from get wallet: ",err); 
        res.status(500).json({message:"server error "})
    }
}

const add_money_to_wallet = async(req,res)=>{
    const {amount} = req.body;
     try {
        const order = await razorpayInstance.orders.create({
            amount,
            currency: 'INR',
            receipt: `wallet_rcpt_topup_${Date.now()}`       
        })
        
        res.status(201).json({success: false, orderId: order.id, amount: order.amount, KeyId})
    } catch (error) {
        console.log("Error from add_money_to_wallet: ",err); 
        res.status(500).json({message:"server error "})
    }
}

const verify_payment_of_wallet = async (req,res) =>{
    cosnt 
    try {
        //wallet nilavilundenkil update cheyyunnathe ollu illenkil create cheyyunnilla check it on Gamzys also.
        
    } catch (error) {
        console.log("Error from verify_payment_of_wallet: ",err); 
        res.status(500).json({message:"server error "})
    }
}

 
module.exports = {
    get_wallet,
    add_money_to_wallet
    
} 