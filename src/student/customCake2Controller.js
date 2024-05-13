const Tray = require('./TrayModel');
const Student = require('./studentModel');  


exports.createCustomCake2 = async (req, res) => {
    console.log("Session data:", req.session);  

    if (!req.session || !req.session.korisnik || !req.session.korisnik._id) {
        console.log("No valid session for user.");
        return res.status(401).json({ message: "Niste prijavljeni ili sesija ne postoji." });
    }

    try {
        const newTray = new Tray({
            ...req.body,
            studentId: req.session.korisnik._id ,
            pickupDate: new Date(pickupDate) 
        });

        console.log("New Tray being saved:", newTray);
        await newTray.save();
        res.status(201).json({ message: 'Pladanj je uspješno spremljen!' });
    } catch (error) {
        console.error('Error saving tray:', error);
        res.status(500).json({ message: 'Došlo je do greške prilikom spremanja pladnja.', error: error.toString() });
    }
};
