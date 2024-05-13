const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const traySchema = new mongoose.Schema({
    trayCount: Number,
    cakes: [{
        cakeType: String,
        count: Number,
        pricePerPiece: Number,
        totalCalories: Number
    }],
    totalPrice: Number,
    totalCalories: Number,
    studentId: { type: Schema.Types.ObjectId, ref: 'student' }
});

const Tray = mongoose.models.Tray || mongoose.model('Tray', traySchema);

module.exports = Tray;
