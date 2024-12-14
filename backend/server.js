const express = require('express');
const multer = require('multer');
const cors = require('cors');
const vision = require('@google-cloud/vision');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize the Google Cloud Vision client
const client = new vision.ImageAnnotatorClient({
    keyFilename: path.join(__dirname, 'config/digihealth-442908-828dc2a2a506.json'), // Path to the JSON key file
});

// Initialize Supabase client
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHptZmhha3Fkd3F1c3phcWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MDgyNTAsImV4cCI6MjA0Njk4NDI1MH0.4euPXQKyddaJuGhf5Etqdla8LF-h-p-gs1uVxw6dutQ';
const supabase = createClient(supabaseUrl, supabaseKey);

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
        const filePath = req.file.path;
        const { user_id, disease_name, since, disease_type } = req.body;

        console.log('Received file:', filePath);
        console.log('Received data:', { user_id, disease_name, since, disease_type });

        // Perform text detection using Google Cloud Vision API
        const [result] = await client.textDetection(filePath);
        const detections = result.textAnnotations;
        const extractedText = detections.map(text => text.description).join('\n');

        console.log('Extracted text:', extractedText);

        // Store the extracted text and metadata in Supabase
        const { error: insertError } = await supabase
            .from('documents')
            .insert([
                {
                    user_id,
                    disease_name,
                    since,
                    disease_type,
                    document_url: filePath,
                    extracted_text: extractedText
                }
            ]);

        if (insertError) {
            console.error('Insert Error:', insertError);
            throw insertError;
        }

        res.json({ success: true, data: extractedText });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
