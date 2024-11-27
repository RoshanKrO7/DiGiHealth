const vision = require('@google-cloud/vision');
const fs = require('fs');

// Initialize Vision API client
const client = new vision.ImageAnnotatorClient({
    keyFilename: './digihealth-442908-828dc2a2a506.json',
});

// Function to analyze image and extract text
const analyzeImage = async (filePath) => {
    try {
        const [result] = await client.textDetection(filePath);
        const detections = result.textAnnotations;
        const extractedText = detections[0]?.description || 'No text detected';

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        return extractedText;
    } catch (error) {
        console.error('Error analyzing image:', error);
        throw error;
    }
};

module.exports = { analyzeImage };
