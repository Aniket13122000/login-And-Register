const mongoose =require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    username: {
        type:String
    },
    phonenumber:{
        type:String
    }

});


module.exports=mongoose.model("User",userSchema)