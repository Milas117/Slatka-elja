const mongoose = require('mongoose');
const studentModel = require('./src/student/studentModel'); 

mongoose.connect('mongodb://localhost:27017/abc', {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const createAdmin = async () => {
    const adminUser = new studentModel({
        ime: 'Admin',
        prezime: 'User',
        korisnickoime: 'admin',
        email: 'admin@example.com',
        lozinka: 'SlatkaZelja',
        uloga: 'admin'
    });

    try {
        await adminUser.save();
        console.log('Admin account has been successfully created!');
    } catch (error) {
        console.error('Error creating admin account:', error);
    }

    mongoose.disconnect();
};

createAdmin();
