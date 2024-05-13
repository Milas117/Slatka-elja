const express = require('express');
var session = require('express-session');
const cors = require('cors');
const path = require('path');
const app = express();


const Image = require('./src/student/imageModel');  
const CustomCake = require('./src/student/customCakeModel');
const Cake = require('./src/student/cakeModel');
const Student = require('./src/student/studentModel'); 
const Tray = require('./src/student/TrayModel');  


app.use(session({
    secret: 'tajna',  
    resave: false,         
    saveUninitialized: false, 
    cookie: { secure: false, httpOnly: true } 
  }));
app.use(express.static('public'));
var routes = require('./Route/routes');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
app.use(express.static(path.join(__dirname, 'src/public')));
const uploadRoutes = require('./Route/uploadRoutes');
const imageModel = require('./src/student/imageModel');

app.use('/upload', uploadRoutes);

app.get('*.css', (req, res, next) => {
    res.header('Content-Type', 'text/css');
    next();
});

app.listen(3000, function check(error) {
    if (error)
        console.log("Error")
    else
        console.log("Server started and listening on port 3000");
});

mongoose.connect("mongodb://localhost:27017/abc", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected successfully to MongoDB'))
    .catch((err) => { console.error(err); });
    

app.use(express.json());
app.use(cors());

app.get('/gallery', async (req, res) => {
    try {
        if (!req.session || !req.session.korisnik) {
            return res.status(401).json({ error: 'Niste prijavljeni!' });
        }
        const images = await Image.find({ isDeleted: false });
        const customCakes = await CustomCake.find({ isDeleted: false }).populate('studentId');
        const trays = await Tray.find({ isDeleted: false }).populate('studentId');

        const galleryData = [
            ...images.map(img => ({
                _id: img._id,
                tip: 'Slike',
                imagePath: img.imagePath,
                orderedByUsername: img.comments[0]?.commenterName,
                comments: img.comments.map(c => `${c.commenterName}: ${c.commentText}`).join(', '),
                datumPreuzimanja: img.pickupDate.toLocaleDateString("hr-HR"),
                status: img.status,
            })),
            ...customCakes.map(cake => ({
                _id: cake._id,
                tip: 'Torte',
                detalji: `Oblik: ${cake.shape}, Veličina: ${cake.size}, Boja: ${cake.color}, Biskvit: ${cake.biscuit}, Krema: ${cake.cream}, Katovi: ${cake.kat}, Rođendan: ${cake.birthday ? 'Da' : 'Ne'}, Godine: ${cake.age || 'N/A'}, Cijena: €${cake.totalPrice.toFixed(2)}, Datum preuzimanja: ${cake.pickupDateTime.toLocaleDateString()}`,
                orderedByUsername: cake.studentId.korisnickoime,
                datumPreuzimanja: cake.pickupDateTime.toLocaleDateString("hr-HR"),
                status: cake.status,
            })),
            ...trays.map(tray => ({
                _id: tray._id,
                tip: 'Kolači',
                brojTacni: tray.trayCount,
                kolači: tray.cakes.map(cake => `Vrsta kolača: ${cake.cakeType}, Broj: ${cake.count}, Cijena po komadu: €${cake.pricePerPiece.toFixed(2)}`),
                ukupnaCijena: `€${tray.totalPrice.toFixed(2)}`,
                orderedByUsername: tray.studentId.korisnickoime,
                datumPreuzimanja: tray.pickupDate.toLocaleDateString("hr-HR"),
                status: tray.status,
            }))
        ];

        console.log(galleryData);
        res.json(galleryData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});


app.get('/my-orders', async (req, res) => {
    if (!req.session || !req.session.korisnik) {
        return res.status(401).json({ error: 'Niste prijavljeni!' });
    }

    try {
        const customCakes = await CustomCake.find({ studentId: req.session.korisnik._id }).populate('studentId');
        const trays = await Tray.find({ studentId: req.session.korisnik._id }).populate('studentId');
        const images = await Image.find({ studentId: req.session.korisnik._id }).populate('studentId'); 
        
        const myOrdersData = [
            ...images.map(img => ({
                _id: img._id,
                tip: 'Slike',
                imagePath: img.imagePath,
                orderedByUsername: img.comments[0]?.commenterName,
                comments: img.comments.map(c => `${c.commenterName}: ${c.commentText}`).join(', '),
                datumKreiranja: img.createdAt.toLocaleDateString("hr-HR"),
                datumPreuzimanja: img.pickupDate.toLocaleDateString("hr-HR"),
                status: img.status,
                
            })),
            ...customCakes.map(cake => ({
                _id: cake._id,
                tip: 'Torte',
                detalji: `Oblik: ${cake.shape}, Veličina: ${cake.size}, Boja: ${cake.color}, Biskvit: ${cake.biscuit}, Krema: ${cake.cream}, Katovi: ${cake.kat}, Rođendan: ${cake.birthday ? 'Da' : 'Ne'}, Godine: ${cake.age || 'N/A'}, Cijena: €${cake.totalPrice.toFixed(2)}`,
                datumPreuzimanja: cake.pickupDateTime.toLocaleDateString("hr-HR"),
                datumKreiranja: cake.createdAt.toLocaleDateString("hr-HR"), 
                status: cake.status, 
                orderedByUsername: cake.studentId.korisnickoime
            })),
            
            
            ...trays.map(tray => ({
                _id: tray._id,
                tip: 'Kolači',
                brojTacni: tray.trayCount,
                kolači: tray.cakes.map(cake => `Vrsta kolača: ${cake.cakeType}, Broj: ${cake.count}, Cijena po komadu: €${cake.pricePerPiece.toFixed(2)}`),
                ukupnaCijena: `€${tray.totalPrice.toFixed(2)}`,
                datumKreiranja: tray.createdAt.toLocaleDateString("hr-HR"),
                datumPreuzimanja: tray.pickupDate.toLocaleDateString("hr-HR"),
                status: tray.status,
                orderedByUsername: tray.studentId.korisnickoime
                
            }))
        ];

        res.json(myOrdersData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});



app.use((req, res, next) => {
    console.log("Received request:", req.method, req.originalUrl, req.body);
    next();
});
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/Prijava.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'Prijava.html'));
});

app.get('/gallery-view', function(req, res) {
    res.sendFile(path.join(__dirname, 'src', 'public', 'gallery.html'));
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {fallthrough: false, index: false}));




app.get('/session-status', (req, res) => {
    if (req.session.korisnik) {
      res.json({ loggedIn: true, korisnickoime: req.session.korisnik.korisnickoime });
    } else {
      res.json({ loggedIn: false });
    }
  });

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/Prijava.html');  
    });
});
app.use(cors({
    origin: ['http://localhost:3000'], 
    credentials: true
}));




app.post('/save-tray', async (req, res) => {
    const { trayCount, cakes, totalPrice, totalCalories,  pickupDate } = req.body;
    const studentId = req.session.korisnik && req.session.korisnik._id;  

    if (!studentId) {
        return res.status(401).json({ message: "Niste prijavljeni." });
    }

    try {
        const newTray = new Tray({
            studentId,
            trayCount,
            cakes,
            totalPrice,
            totalCalories,
            pickupDate: new Date(pickupDate) 
        });
        await newTray.save();
        res.status(201).json({ message: 'Tray saved successfully!' });
    } catch (error) {
        console.error('Error saving tray:', error);
        res.status(500).json({ error: 'Failed to save tray', message: error.toString() });
    }
});

app.post('/mark-order-as-deleted/:id', async (req, res) => {
    try {
        let result = await Image.findByIdAndUpdate(req.params.id, { isDeleted: true });
        if (!result) {
            result = await CustomCake.findByIdAndUpdate(req.params.id, { isDeleted: true });
        }
        if (!result) {
            result = await Tray.findByIdAndUpdate(req.params.id, { isDeleted: true });
        }

        if (result) {
            res.json({ message: 'Narudžba je obrisana!' });
        } else {
            res.status(404).json({ message: 'Narudžba nije pronađena!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Došlo je do greške pri označavanju narudžbe kao obrisane.' });
    }
});



app.post('/update-order-status', async (req, res) => {
    const { orderId, status } = req.body;

    try {
      
        let updatedOrder = await CustomCake.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) {
            updatedOrder = await Tray.findByIdAndUpdate(orderId, { status }, { new: true });
        }
        if (!updatedOrder) {
            updatedOrder = await Image.findByIdAndUpdate(orderId, { status }, { new: true });
        }

        if (updatedOrder) {
            res.json({ message: 'Status narudžbe ažuriran.' });
        } else {
            res.status(404).send('Narudžba nije pronađena.');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Greška pri ažuriranju statusa narudžbe.');
    }
});
app.get('/get-user-details', async (req, res) => {
    if (!req.session.korisnik) {
        return res.status(401).json({ error: 'Niste prijavljeni!' });
    }
    try {
        const user = await Student.findById(req.session.korisnik._id);
        if (!user) {
            return res.status(404).send('Korisnik nije pronađen.');
        }
        res.json({ korisnickoime: user.korisnickoime, ime: user.ime, prezime: user.prezime });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Došlo je do server greške.');
    }
});

app.post('/update-user-password', async (req, res) => {
    if (!req.session.korisnik) {
        return res.status(401).json({ message: 'Niste prijavljeni!' });
    }

    const { oldPassword, newPassword } = req.body;
    try {
        const user = await Student.findById(req.session.korisnik._id);
        if (!user) {
            return res.status(404).send('Korisnik nije pronađen.');
        }

        if (user.lozinka === oldPassword) {
            user.lozinka = newPassword; // Ovo bi trebalo biti hashirano u pravoj aplikaciji!
            await user.save();
            res.send({ success: true, message: 'Lozinka je ažurirana.' });
        } else {
            res.status(400).send({ success: false, message: 'Stara lozinka nije ispravna.' });
        }
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send({ message: 'Došlo je do server greške.' });
    }
});


