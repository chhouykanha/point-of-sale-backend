const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'name is required']
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        
        trim: true,
        required: [true, 'email is required']
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, 'password is required']
    },
    
    role: {
        type: String,
        enum: ['admin', 'cashier', 'super'],
        required: [true, 'role is required']
    }
},{
    timestamps:true
})

const UserModel = mongoose.model('User', schema)

module.exports = UserModel
