const Orders = require('../../model/user/order_model')
const Wallet = require('../../model/user/wallet_model')
const Products = require('../../model/adminModel/product_model')


const viewOrdersList = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const [orders, totalOrders] = await Promise.all([
        Orders.find()
              .sort({ orderDate: -1 })
              .skip(skip)
              .limit(limit),
        Orders.countDocuments(),
      ]);
  
      if (!orders) {
        res.status(400).json({ success: false, message: "No orders found." });
      }
  
      const totalPages = Math.ceil(totalOrders / limit);
  
      res.render('admin/orders', {
        orders,
        currentPage: page,
        skip,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error from orders' });
    }
  };


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



const updateOrderStatus = async(req,res)=>{
    const orderId = req.params.orderId;
    const status = req.body.status
    const cancelAt = req.body.cancelAt

    try {
        if(!orderId){
            return res.status(400).json({success:false,message:"No orderId found"})
        }
        const order = await Orders.findById({_id:orderId})
        console.log(order);
        
        if(!order){
            return res.status(400).json({success:false,message:"No order found with this OrderId."})
        }
        order.products.forEach(p=>{
          p.status = "Delivered"
        })
        if(status === "Delivered"){
            order.paymentStatus = "Success"
        }

        order.status = status;
        if(cancelAt){
            order.cancelAt = cancelAt;
        }
        await order.save();
        console.log("============oreder:",order);
        
        res.status(200).json({success: true, message:`Status updated successfully to ${status}`})

        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Error from updateOrderStatus'});
    }
}


const return_approve_or_reject = async (req,res)=>{
    const orderId = req.params.orderId
    const {productId,status} = req.body
    try {
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong, cannot find orderId, Please try again"
            });
        }
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong, cannot find productId, Please try again"
            });
        }
        
            const order = await Orders.findById(orderId)
            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }
            const item = order.products.find((item)=>{  
                return item.productId.toString() === productId

            })
            const product = await Products.findById(item.productId);
            
            item.returnStatus = status;
         if(status === "Return Approved"){
            const wallet = await Wallet.findOne({user: order.userId})
            const amount = item.quantity * item.price;
            wallet.balance += amount;
            wallet.transactions.push({
            amount,
            type: 'credit',
            description:`Refunded for the product ${product.name}, ₹${amount}. `,
            date: new Date(),
            })
            await wallet.save();

         }

         await order.save();
         return res.json({ success: true, message: `Product ${status} successfully!` });

        
    } catch (error) {
        console.log("Error of return_approve_or_reject: ",error); 
        res.status(500).json({message:"server error"})  
    }
}

module.exports = {
    viewOrdersList,
    orderDetailedView,
    updateOrderStatus,
    return_approve_or_reject
}