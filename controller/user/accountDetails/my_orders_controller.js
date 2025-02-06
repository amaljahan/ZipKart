const Orders = require('../../../model/user/order_model')
const Wallet = require('../../../model/user/wallet_model')
const Product = require('../../../model/adminModel/product_model')


const view_my_orders = async(req,res)=>{
    try {
        const userId = req.session.userId
        const orders = await Orders.find({userId}).sort({orderDate: -1})
        if(!orders){
            res.render('user/accountDetails/my_Orders',{session: req.session})
        }
                
        res.render('user/accountDetails/my_Orders',{session: req.session,orders})

        
    } catch (error) {
        console.log("Error of VIEW  MY orders  : ",error);
        res.status(500).json({message:"server error"})
    }
}



const view_order = async(req,res)=>{
      
    try {
        const orderId = req.params.orderId
        const userId = req.session.userId

        const order = await Orders.findOne({orderId}).populate("products.productId")
        if(!order){
            res.redirect('/zipkart/user/accountDetails/view-order/')
        }            

        res.render('user/accountDetails/view_order',{session: req.session, order})

    } catch (error) {
        console.log("Error of view order: ",error);
        res.status(500).json({message:"server error"})
    }
}


const cancelOrder = async (req,res)=>{
    const orderId = req.params.orderId
    const productId = req.body.productId
    const userId = req.session.userId
    try {
        if(!orderId || !productId){
            res.status(400).json({success: false , message:" Something went wrong,cannot find producId and orderId, Please try again"})
        }

        const order = await Orders.findOne({orderId})
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

         const item = order.products.find((item)=>{             
            return item.productId.toString() == productId

         })
         
       

         const product = await Product.findById({_id:item.productId})
         if (!product) {
             return res.status(404).json({ success: false, message: "Product not found" });
        }
        const cancelledAmount = item.quantity * product.price;
        product.stock += item.quantity
        item.status = "Cancelled";
        order.totalPrice -= cancelledAmount
        order.subtotal -= cancelledAmount
        order.deliveryCharge = order.subtotal < 500 ? 40 : 0;

        const StatusCancelledNot =  order.products.filter((item)=>{
            return item.status != "Cancelled";
        })

        if(StatusCancelledNot.length>=1){
            order.status = order.status;
        }else{
            order.status = 'Cancelled';
            order.subtotal = 0
            order.totalPrice = 0
            order.deliveryCharge = 0
        }

        if(order.paymentMethod !== "COD"){
            const wallet = await Wallet.findOne({user: userId})
            if(!wallet){
                res.status(400).json({success:false, message: "Wallet not found."})
            }
            wallet.balance += cancelledAmount;
            wallet.transactions.push({
                amount: cancelledAmount,
                type: 'credit',
                description:`Refund from cancelled item ${product.name} from Order ${order.orderId}`,
                date: new Date(),
            })
            await wallet.save();
        }
            

            await Promise.all([product.save(), order.save()]);

            return res.json({ success: true, message: 'Item cancelled successfully!' });


    } catch (error) {
        console.log("Error of cancel order: ",error);
        res.status(500).json({message:"server error"})        
    }
}


const return_product = async (req,res)=>{
    const orderId = req.params.orderId
    const productId = req.body.productId
    const userId = req.session.userId
    try {
        if(!orderId || !productId){
            res.status(400).json({success: false , message:" Something went wrong,cannot find producId and orderId, Please try again"})
        }
        const order = await Orders.findOne({orderId})
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        const item = order.products.find((item)=>{             
            return item.productId.toString() == productId

         })
         item.returnStatus = "Return Requested";
         await order.save();
         return res.json({ success: true, message: 'Product return request sended successfully!' });

        
    } catch (error) {
        console.log("Error of return order: ",error);
        res.status(500).json({message:"server error"})  
    }
}

module.exports = {
    view_my_orders,
    view_order,
    cancelOrder,
    return_product
}