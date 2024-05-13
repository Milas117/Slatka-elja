const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const traySchema = new mongoose.Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'student' },
    trayCount: Number,
    cakes: [{
        cakeType: String,
        count: Number,
        pricePerPiece: Number,
        totalCalories: Number
    }],
    totalPrice: Number,
    totalCalories: Number,
    pickupDate: { type: Date, required: true },
    status: { type: String, enum: ['na čekanju', 'prihvaćeno', 'odbijeno'], default: 'na čekanju' }, 
    isDeleted: { type: Boolean, default: false }
},{ timestamps: true }); 

module.exports = mongoose.model('Tray', traySchema);
