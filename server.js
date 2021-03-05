// Dependencies 
const express = require('express');
const path = require('path');
const database = require('./db/db');
const fs = require('fs');

// Global path for Database
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

// Create new note 
app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    let testID = 100;
    // Code to add ID numbers on top the test ID of 100
    for (let i = 0; i < database.length; i++) {
        let note = database[i];
        if (note.id > testID) {
            testID = note.id;
        }
    };
    newNote.id = testID + 1;
    // Pushes the new note to the database file
    database.push(newNote);
    // Rewrites the database file
    fs.writeFile(dbPath, JSON.stringify(database), err =>
    err ? console.log(err) : console.log('Success! Note saved!'));
    // Returns the note onto the page
    res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
    const noteID = req.params.id;
    // Checks for the note to be deleted by ID
    for (let i = 0; i < database.length; i++) {
        if (database[i].id == noteID) { 
            // Removes from database
            database.splice(i, 1);
            break;
        }
    };
    // Rewrites database file
    fs.writeFile(dbPath, JSON.stringify(database), err =>
    err ? console.log(err) : console.log('Success! Note deleted!'));
    // Returns to page
    res.json(database);
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));