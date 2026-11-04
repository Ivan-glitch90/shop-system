const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    email:{//for email
        type:String,
        required:true,
        unique:true,
    },

    role:{//role default emp
        type:String,
        enum:["owner","employee"],
        default:"employee"
    },

    name:{//full name from Google's displayName
        type:String,
        required:true
    }

},{
    timestamps:true
});

module.exports=mongoose.model("User",userSchema);