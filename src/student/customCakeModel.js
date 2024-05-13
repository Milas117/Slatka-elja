const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customCakeSchema = new mongoose.Schema({
    shape: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    biscuit: { type: String, required: true },
    cream: { type: String, required: true },
    kat: { type: String, required: true },
    birthday: { type: Boolean, required: true },
    age: { type: Number },
    totalPrice: { type: Number, required: true },
    pickupDateTime: { type: Date, required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'student' },  
    status: { type: String, enum: ['na čekanju', 'prihvaćeno', 'odbijeno'], default: 'na čekanju' }, 
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true }); 

module.exports = mongoose.model('CustomCake', customCakeSchema);
