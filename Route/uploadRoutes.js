const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Image = require('../src/student/imageModel');

function isAuthenticated(req, res, next) {
    if (req.session && req.session.korisnik) {
        next();
    } else {
        res.status(401).send('Morate biti prijavljeni da biste izvršili ovu akciju.');
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const { comment, pickupDate } = req.body;  // Izvucite pickupDate

        const newImage = new Image({
            imagePath: req.file.path,
            studentId: req.session.korisnik._id,
            comments: comment ? [{ commenterName: req.session.korisnik.korisnickoime, commentText: comment }] : [],
            pickupDate: new Date(pickupDate)  // Spremite datum
        });

        await newImage.save();
        res.status(201).json({ message: 'Slika je uspješno poslana!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
