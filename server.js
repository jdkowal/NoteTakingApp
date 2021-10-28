const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const PORT = process.env.PORT || 4001;
const app = express();
const notes = require("./db/db.json")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//get
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get("/api/notes", (req, res) => res.json(notes));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});
//post

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            note_id: uuid(),
        };

        // Obtain existing reviews
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                // const parsedNotes = JSON.parse(data);

                // Add a new review
                notes.push(newNote);

                // Write updated reviews back to the file
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(notes, null, 2),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!')
                );
            }
        });
        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

// delete 

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, notes);
    res.json(true);
});


//listen 
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
