const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transSchema = new Schema({

    transType:{
        type : String,
        required : true
    },
    amount:{
        type :Number,
        required:true
    },
    date:{
        type: String,
        required:true
    }
});

const profileSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    balance:{
        type:Number,
        default:0
    },
    transHistory:[transSchema]
});



var Profiles = mongoose.model('Profile', profileSchema);
module.exports = Profiles;
