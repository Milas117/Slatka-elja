const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema({
    imagePath: {
        type: String,
        required: true
    },
    comments: [{
        commenterName: String,
        commentText: String
    }],
    studentId: { type: Schema.Types.ObjectId, ref: 'student' } ,
    pickupDate: { type: Date, required: true },
    status: { type: String, enum: ['na čekanju', 'prihvaćeno', 'odbijeno'], default: 'na čekanju' }, 
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true }); 

module.exports = mongoose.model('Image', imageSchema);
