const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API to get the list of images from the "images" folder
app.get('/api/images', (req, res) => {
    const imageDir = path.join(__dirname, 'public', 'images');

    fs.readdir(imageDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Unable to read images directory" });
        }
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
        res.json(imageFiles);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
