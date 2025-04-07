from flask import Flask, request, render_template, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key dari .env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get("text", "").strip()
    source_lang = data.get("source_lang", "Indonesian").strip()
    target_lang = data.get("target_lang", "English").strip()
    style = data.get("style", "Casual").strip()  # Default Casual
    
    if not text:
        return jsonify({"error": "Teks tidak boleh kosong"}), 400
    
    prompt = f"Terjemahkan dari {source_lang} ke {target_lang} dengan gaya {style}. Hanya berikan hasil terjemahannya tanpa tambahan teks lain: {text}"

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        # Pastikan hanya mengambil hasil inti tanpa teks tambahan
        translation = response.text.strip() if response.text else "Terjemahan tidak ditemukan."
        
        return jsonify({"translation": translation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
