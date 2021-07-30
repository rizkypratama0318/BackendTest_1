const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rizkySchema = new mongoose.Schema ({
    userName: {
        type: String,
        required: [true, 'username is required']
    },
    accountNumber: {
        type: String,
        required: true,
    },
    emailAddress: {
        type: String,
        required: [true, 'email is required']
    },
    identityNumber: {
        type: String,
        required: [true, 'identity is required']
    }, 
    
},
{ collection: "rizky" }
);

const rizky = mongoose.model('rizky', rizkySchema);
module.exports = {rizky, rizkySchema};