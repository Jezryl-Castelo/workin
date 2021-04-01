const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Location = require('./models/locations');

mongoose.connect('mongodb://localhost:27017/workin-app', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('home')
});
app.get('/locations', async (req, res) => {
    const locations = await Location.find({})
    res.render('locations/index', { locations })
});
app.get('/locations/new', (req, res) => {
    res.render('locations/new');
});
app.post('/locations', async (req,res) => {
    const location = new Location(req.body.location);
    await location.save();
    res.redirect(`/locations/${location._id}`)
})
app.get('/locations/:id', async (req, res) => {
    const location = await Location.findById(req.params.id)
    res.render('locations/show', { location });
});

app.listen(3002, ()=> {
    console.log('Serving on port 3002')
})