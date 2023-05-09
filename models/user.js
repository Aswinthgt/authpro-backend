const mongoose = require('../config/database');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    role: String,
    filename:{
        type: String,
        required: false,
    },
    imagePath: {
        type: String,
        required: false,
    }
});


const User = mongoose.model('User', userSchema);

module.exports = {User};