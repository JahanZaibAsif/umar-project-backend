require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.databaseLink);
const userSchema = new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    admin:{
        type:Boolean,
        default:false
    }
});

const Users = mongoose.model('users',userSchema);

module.exports = Users;