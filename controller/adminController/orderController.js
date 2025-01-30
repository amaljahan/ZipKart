const Orders = require('../../model/user/order_model')


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
    console.log(req.body);
    console.log(cancelAt);
    
    

    try {
        if(!orderId){
            return res.status(400).json({success:false,message:"No orderId found"})
        }
        const order = await Orders.findById({_id:orderId})
        console.log(order);
        
        if(!order){
            return res.status(400).json({success:false,message:"No order found with this OrderId."})
        }

        order.status = status;
        if(cancelAt){
            order.cancelAt = cancelAt;
        }
        await order.save();
        res.status(200).json({success: true, message:`Status updated successfully to ${status}`})

        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Error from updateOrderStatus'});
    }
}

module.exports = {
    viewOrdersList,
    orderDetailedView,
    updateOrderStatus,
}