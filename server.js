// Dependencies 
const express = require('express');
const path = require('path');
const database = require('./db/db');

// Setting up Express
const app = express();
const PORT = process.env.PORT || 3000;

// Setting up Express to parse data
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

// API routes
app.get('/api/notes', (req, res) => res.json(database));

// Create new note 
app.post('/api/notes', (req, res) => {
// code for adding notes to db file here
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));