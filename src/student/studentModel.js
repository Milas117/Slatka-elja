var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var studentSchema = new Schema({

    ime: {
        type: String,
        required: true
    },
    prezime: {
        type: String,
        required: true
    },
    korisnickoime: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    lozinka: {
        type: String,
        required: true
    },
    uloga: {  
        type: String,
        default: 'User'  
    }
});

module.exports = mongoose.model('student', studentSchema);