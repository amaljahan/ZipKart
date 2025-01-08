const { findByIdAndDelete } = require("../../../model/adminModel/product_model");
const Addresses = require("../../../model/user/accountDetailsModels/addressModel");
const { get_category_vised_products } = require("../home_controller");

//get all addresses
const view_addresses =   async(req,res)=>{
    
    try{
        const userId = req.params.id
        if(userId){
                    const addresses = await Addresses.find({userId})
                    res.render('user/accountDetails/manage_address',{session:req.session,addresses}) 
        }
        

    }catch(err){
        console.log("Error of view_addresses: ",err);
        res.status(500).json({message:"server error"})
    }
}

const get_add_address = async(req,res)=>{
    console.log("==============================================================");
    
    try{
        
        res.render('user/accountDetails/add_new_address',{session:req.session}) 

    }catch(err){
        console.log("Error of get_add_address: ",err);
        res.status(500).json({message:"server error"})
    }
}

const add_address = async(req,res)=>{
    
    console.log("req.body :==>", req.body);
    const { userId, firstName, lastName, phoneNumber, pincode, locality, address, cityDistrictTown, state, landmark, alternatePhone, addressType } = req.body;

    try{
        if (!userId || !firstName || !phoneNumber || !pincode || !locality || !address || !cityDistrictTown || !state || !addressType) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        //checking address exist 
        const existingAddress = await Addresses.findOne({ 
            userId, 
            address, 
            pincode 
        });
        
        if (existingAddress) {
            return res.status(400).json({ 
                message: "This address already exists for the user" 
            });
        }
        

        const newAddress = new Addresses({
            userId,
            firstName,
            lastName,
            phoneNumber,
            pincode,
            locality,
            address,
            cityDistrictTown,
            state,
            landmark,
            alternatePhone,
            addressType
        });

        await newAddress.save();

        res.status(201).json({
            success:true,
            message: "Address added successfully",
        });
    } catch (error) {
        console.log("error  of add_address:",error);
        res.status(500).json({
            message: "Failed to add address",
            error: error.message
        });
    }
};




const get_edit_address = async(req,res)=>{
    const addressId  = req.params.id; 
    
    try{
        console.log("=========this is at edit addressss========",req.session.user);

        const address = await Addresses.findById(addressId);


        
        res.render('user/accountDetails/edit_address',{session:req.session,address}) 

    }catch(err){
        console.log("Error: ",err);
        res.status(500).json({message:"server error"})
    }
}

const edit_address = async(req,res)=>{
    console.log("req.body :==>", req.body);
       
    try{
        console.log(req.params.id);
        
        const addressId  = req.params.id; 
        const { userId, firstName, lastName, phoneNumber, pincode, locality, address, cityDistrictTown, state, landmark, alternatePhone, addressType } = req.body;

        // Validate address ID
        if (!addressId) {
            return res.status(400).json({ message: "Address ID is required" });
        }

        const [otherAddress,existingAddress] = await Promise.all([Addresses.findOne({ 
                userId, 
                address, 
                pincode 
            }),
            Addresses.findById(addressId)
        ])
        // const existingAddress = await Addresses.findById(addressId);
        
        // const otherAddress = await Addresses.findOne({ 
        //     userId, 
        //     address, 
        //     pincode 
        // });

        
        if (otherAddress._id === existingAddress) { 
           otherAddress = await Addresses.findOne({ 
                userId, 
                address, 
                pincode 
            }).skip(1)
        }
        // if (otherAddress._id === existingAddress) {
        //     return res.status(400).json({ 
        //         message: "This address already exists for the user" 
        //     });
        // }

        if (!existingAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Update the address fields
        const updatedAddress = await Addresses.findByIdAndUpdate(
            addressId,
            {
                firstName,
                lastName,
                phoneNumber,
                pincode,
                locality,
                address,
                cityDistrictTown,
                state,
                landmark,
                alternatePhone,
                addressType,
            },
            { new: true, runValidators: true } // Return the updated document and apply validation
        );

        res.status(200).json({
            success:"success",
            message: "Address updated successfully",
            data: updatedAddress,
        });
    } catch (error) {
        console.log("error : ",error); 
        res.status(500).json({
            message: "Failed to update address",
            error: error.message,
        });
    }
};

const delete_address = async(req,res)=>{
    console.log("12345678765432345654323456765434567");
    
    try{
        const address = await Addresses.findByIdAndDelete(req.params.id)
        if(!address){
            res.status(404).json({message:"Adress not found"})
        }
        res.status(200).json({message:"Address Deleted Successfully"})

    }catch(err){
        console.log("error  of delete_address:", err);
        res.status(500).json({
            message: "Failed to delete address",
            error: error.message
        });
    }
}

module.exports = {
    view_addresses,  
    add_address,
    get_add_address,
    get_edit_address,
    edit_address,
    delete_address,
}   