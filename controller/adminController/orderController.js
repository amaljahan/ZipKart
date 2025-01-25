const Orders = require('../../model/user/order_model')


const viewOrdersList = async(req,res)=>{
    try {
        const orders = await Orders.find();
        if(!orders){
            res.status(400).json({success:false,message:"No orders found."})
        }
        res.render('admin/orders',{orders})
    } catch (error) {
        console.error(error);
        res.status(500).send({message:'Error from orders'});
    }
}


const orderDetailedView = async(req,res)=>{
    const orderId = req.params.orderId;
    
    try {
        if(!orderId){
           return res.status(400).json({success:false,message:"No orderId found"})

        }
        const order = await Orders.findById(orderId).populate("products.productId")
            console.log(order);
        
        if(!order){
            return res.status(400).json({success:false,message:"No order found with this OrderId."})
        }

         res.render('admin/order_detailed_view',{order})
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Error from order view'});
    }
}

module.exports = {
    viewOrdersList,
    orderDetailedView,
}