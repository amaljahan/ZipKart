const mongoose = require('mongoose')

const connectDB = async()=>{
    try{
        const connect = await mongoose.connect(process.env.DB_CONNECTION_STRING);
        console.log("Database connected :",
            connect.connection.host,//host name 
            connect.connection.name//db name
        );
    }catch(err){  
        console.log("Error DB:",err);
        process.exit(1);//it immediately stop execution.
        
    }
}

module.exports = connectDB