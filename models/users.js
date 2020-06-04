const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        unique : true,
        required : true   
    }
});

module.exports = mongoose.model('user', userSchema);