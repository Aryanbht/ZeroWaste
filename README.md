# Zero-Waste Vision ♻️

**AI-powered waste classification and disposal guidance system.**

Zero-Waste Vision uses Google Gemini 2.5 Flash / 2.0 Flash to dynamically identify waste items and provide real-time disposal steps, creative reuse ideas, and carbon saving facts.

## ✨ Features
- **Dynamic AI Classification:** Uses Gemini Vision API to identify any object.
- **Eco-Sleek UI:** Modern, glassmorphic design with a futuristic "Cyber-Eco" aesthetic.
- **Real-time Insights:** Instant disposal tips, reuse suggestions, and carbon footprint data.
- **Dual Mode:** Upload images or use your live camera for real-time scanning.

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Google Gemini API Key](https://aistudio.google.com/)

### 🛠️ Backend Setup (Python/FastAPI)
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file and add your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### 💻 Frontend Setup (React/Vite)
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🔒 Security Note
**Never** commit your `.env` file. It has been added to `.gitignore` by default to protect your API key.

## 📜 License
MIT
