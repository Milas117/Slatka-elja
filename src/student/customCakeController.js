const CustomCake = require('./customCakeModel');
const Student = require('./studentModel');  

exports.createCustomCake = async (req, res) => {
    if (!req.session || !req.session.korisnik || !req.session.korisnik._id) {
        return res.status(401).json({ message: "Niste prijavljeni ili sesija ne postoji." });
    }
    
    try {
        const studentId = req.session.korisnik._id;  

        const customCake = new CustomCake({
            ...req.body, 
            studentId: studentId 
        });

        await customCake.save();
        res.status(201).json({ message: 'Torta je uspješno personalizirana!' });
    } catch (error) {
        console.error('Error creating custom cake:', error);
        res.status(500).json({ message: 'Došlo je do greške prilikom spremanja torte.', error: error.toString() });
    }
};

exports.checkDateAvailability = async (req, res) => {
    try {
        const chosenDate = new Date(req.query.date);
        const startOfDay = new Date(chosenDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(chosenDate.setHours(23, 59, 59, 999));

        const cakes = await CustomCake.find({
            pickupDate: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        res.json({ isAvailable: cakes.length === 0 });
    } catch (error) {
        console.error('Error checking date availability:', error);
        res.status(500).json({ error: error.toString() });
    }
};