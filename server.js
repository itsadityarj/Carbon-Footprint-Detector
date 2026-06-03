const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']); // Forces Node to use Cloudflare/Google DNS

require('dotenv').config(); // Loads variables from .env file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000; 

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfully connected to cloud MongoDB!"))
    .catch(err => console.error("Database connection error:", err));

// Define Database Blueprint (Schema & Model)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    footprintData: mongoose.Schema.Types.Mixed // Accepts any nested calculator JSON structure
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

const User = mongoose.model('User', userSchema);

// Handle POST requests (Save Data)
app.post('/data', async (req, res) => {
    try {
        const newUserData = req.body;
        const user = new User(newUserData);
        await user.save(); // Saves the JSON data as a document in MongoDB

        res.status(200).json({ message: "Data saved successfully" });
    } catch (err) {
        console.error("Error saving data:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Handle GET requests (Fetch Data)
app.get('/data', async (req, res) => {
    try {
        const users = await User.find({}); // Fetches everything from the collection
        res.json({ users: users }); // Matches your original structure exactly
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send('Error reading database');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});