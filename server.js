// Dependencies 
const express = require('express');
const path = require('path');
const database = require('./db/db');
const fs = require('fs');

// global path for DB
const dbPath = path.join(__dirname, './db/db.json')

// Setting up Express
const app = express();
const PORT = process.env.PORT || 3000;

// For accessing assets
app.use(express.static('public'));

// Setting up Express to parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

// Routes for CSS and JS
app.get('./public/assets/js/index.js', (req, res) => res.sendFile(path.join(__dirname, './public/assets/js/index.js')));
app.get('./public/assets/css/styles.css', (req, res) => res.sendFile(path.join(__dirname, './public/assets/css/styles.css')));

// API routes
app.get('/api/notes', (req, res) => res.json(database));
// app.get('/api/notes/:id', (req, res) => res.json(database[req.params.id]));

// Create new note 
app.post('/api/notes', (req, res) => {
    // code for adding notes to db file here
    let newNote = req.body;
    let testID = 100;
    for (let i = 0; i < database.length; i++) {
        let note = database[i];
        if (note.id > testID) {
            testID = note.id;
        }

    };

    newNote.id = testID + 1;

    database.push(newNote);
    fs.writeFile(dbPath, JSON.stringify(database), err =>
    err ? console.log(err) : console.log('Success! Note saved!'));

    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const noteID = req.params.id;
    for (let i = 0; i < database.length; i++) {
        if (database[i].id == noteID) { 
            database.splice(i, 1);
            break;
        }
    };
    fs.writeFile(dbPath, JSON.stringify(database), err =>
    err ? console.log(err) : console.log('Success! Note deleted!'));
    return res.json(database);
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));