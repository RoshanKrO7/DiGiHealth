from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
import fitz  # PyMuPDF
import requests
from io import BytesIO
import hashlib
import spacy
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Supabase
SUPABASE_URL = "https://aqdzmfhakqdwquszaqle.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHptZmhha3Fkd3F1c3phcWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MDgyNTAsImV4cCI6MjA0Njk4NDI1MH0.4euPXQKyddaJuGhf5Etqdla8LF-h-p-gs1uVxw6dutQ"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load spaCy model
nlp = spacy.load("en_core_web_md")

def hash_pdf_content(content):
    hasher = hashlib.sha256()
    hasher.update(content)
    return hasher.hexdigest()

def get_text_vector(text):
    doc = nlp(text)
    return doc.vector

def is_similar_text(vector1, vector2, threshold=0.9):
    similarity = cosine_similarity([vector1], [vector2])[0][0]
    return similarity >= threshold

@app.route('/analyze', methods=['POST'])
def analyze_pdf():
    try:
        # Get the file path and other details from the request
        data = request.get_json()
        file_path = data.get('file_path')
        user_id = data.get('user_id')
        disease_name = data.get('disease_name')
        document_url = data.get('document_url')

        if not file_path or not user_id or not disease_name or not document_url:
            return jsonify({"error": "Missing required fields"}), 400

        # Fetch file from Supabase Storage
        file_url = f"{SUPABASE_URL}/storage/v1/object/public/DiGiHealth/{file_path}"
        response = requests.get(file_url)
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch the file from Supabase"}), 500

        # Generate hash of the PDF content
        file_content = response.content
        file_hash = hash_pdf_content(file_content)
        print(f"File hash: {file_hash}")

        # Check if the file already exists in the database
        existing_files = supabase.table('documents').select('id', 'extracted_text').eq('file_hash', file_hash).execute()
        if existing_files.data:
            return jsonify({"error": "This document already exists in the system."}), 400

        # Open the PDF
        pdf_document = fitz.open(stream=BytesIO(file_content), filetype="pdf")

        extracted_text = ""
        for page_num in range(len(pdf_document)):
            page = pdf_document.load_page(page_num)
            text = page.get_text()
            extracted_text += text + "\n"
        print(f"Extracted text: {extracted_text}")

        # Get vector of the extracted text
        extracted_vector = get_text_vector(extracted_text)

        # Check for similar content in existing documents
        existing_texts = supabase.table('documents').select('extracted_text').execute()
        for existing_text in existing_texts.data:
            existing_vector = get_text_vector(existing_text['extracted_text'])
            if is_similar_text(extracted_vector, existing_vector):
                return jsonify({"error": "A similar document already exists in the system."}), 400

        # Return the extracted text and file hash to the frontend
        return jsonify({
            "success": True,
            "extracted_text": extracted_text,
            "file_hash": file_hash,
            "user_id": user_id,
            "disease_name": disease_name,
            "document_url": document_url
        })

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error to the console
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)