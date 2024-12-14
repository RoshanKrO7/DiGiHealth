const express = require('express');
const { analyzeImage } = require('./visionHandler');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Route to process image
app.post('/api/analyze', upload.single('report'), async (req, res) => {
    try {
        const result = await analyzeImage(req.file.path);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
