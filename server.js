const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from the 'public' folder


// Simulated database file
const databaseFile = 'database.json';

// Handle POST requests to /data
app.post('/data', (req, res) => {
    const newUserData = req.body;

    // Read existing data
    fs.readFile(databaseFile, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading database:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        const database = JSON.parse(data || '{"users": []}');
        database.users.push(newUserData);

        // Write updated data back to file
        fs.writeFile(databaseFile, JSON.stringify(database, null, 2), (err) => {
            if (err) {
                console.error("Error writing to database:", err);
                return res.status(500).json({ message: "Failed to save data" });
            }

            res.status(200).json({ message: "Data saved successfully" });
        });
    });
});

app.get('/data', (req, res) => {
    // Read the current database and send it as a response
    fs.readFile('database.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading database file');
            return;
        }

        const database = JSON.parse(data);  // Parse the existing data
        res.json(database);  // Send the data as JSON response
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
