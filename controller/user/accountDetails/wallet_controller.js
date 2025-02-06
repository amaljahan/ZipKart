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
        const userId = req.session.userId;
        let wallet = await Wallet.findOne({user: userId}).sort({"transaction.date": -1});
        if(!wallet){
            wallet = new Wallet({
                user: userId,
                balance: 0 ,
                transactions: []
            });
            await wallet.save();
        }
        wallet.transactions = wallet.transactions || [];
        wallet.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        


        res.render('user/accountDetails/wallet',{session : req.session, wallet})
    } catch (error) {
        console.log("Error from get wallet: ",error); 
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
        
        res.status(201).json({success: true, orderId: order.id, amount: order.amount, KeyId})
    } catch (error) {
        console.log("Error from add_money_to_wallet: ",error); 
        res.status(500).json({message:"server error "})
    }
}

const verify_payment_of_wallet = async (req,res) =>{
    let {orderId, paymentId, signature, amount} = req.body;
    const generatedsignature = crypto.createHmac('sha256', SecretKey)
                                     .update(orderId + '|' + paymentId)
                                     .digest('hex');
    try {
        
        if(generatedsignature !== signature){
            return res.status(400).json({success: false , message: " Youre payment verification is failed." })
        }
        const userId = req.session.userId
        const wallet = await Wallet.findOne({user: userId})
        if(!wallet){
            res.status(400).json({success:false, message: "Wallet not found."})
        }
        amount = (parseFloat(amount)/100)
        wallet.balance +=  amount;
        wallet.transactions.push({
            amount,
            type: 'credit',
            description:`Added money through Razorpay. `,
            date: new Date(),
        })
        await wallet.save();
        res.status(200).json({success: true, message: 'Payment verified, Wallet updated Successfully. '})


    } catch (error) {
        console.log("Error from verify_payment_of_wallet: ",error); 
        res.status(500).json({message:"server error "})
    }
}

 
module.exports = {
    get_wallet,
    add_money_to_wallet,
    verify_payment_of_wallet,

    
} 