"""
Zero-Waste Vision — FastAPI Backend
Endpoints:
  POST /api/classify        — image upload classification
  WS   /api/ws/realtime     — webcam frame stream classification
  GET  /api/health          — health check
"""

import os
import io
from typing import Optional
from starlette.concurrency import run_in_threadpool

from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from classifier import classify_image_bytes, classify_base64_frame

load_dotenv()

app = FastAPI(
    title="Zero-Waste Vision API",
    description="AI-powered waste classification using Gemini Vision",
    version="1.0.0",
)

# Allow React dev server on port 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    api_key = os.getenv("GEMINI_API_KEY", "")
    key_set = bool(api_key and api_key != "your_gemini_api_key_here")
    return {"status": "ok", "gemini_key_configured": key_set}


@app.post("/api/classify")
async def classify(file: UploadFile = File(...)):
    """Accept an uploaded image and return a garbage classification."""
    # Validate
    content_type = file.content_type or ""
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    image_bytes = await file.read()
    if len(image_bytes) > 20 * 1024 * 1024:  # 20 MB limit
        raise HTTPException(status_code=413, detail="Image too large. Maximum size is 20 MB.")

    try:
        result = await run_in_threadpool(classify_image_bytes, image_bytes, content_type)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")


@app.websocket("/api/ws/realtime")
async def realtime_ws(websocket: WebSocket):
    """
    WebSocket endpoint for real-time webcam classification.
    Client sends: JSON { "frame": "<base64 JPEG data URI>" }
    Server sends: JSON classification result
    """
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            frame_b64 = data.get("frame", "")
            if not frame_b64:
                await websocket.send_json({"error": "No frame data received."})
                continue
            try:
                result = await run_in_threadpool(classify_base64_frame, frame_b64)
                await websocket.send_json(result)
            except Exception as e:
                await websocket.send_json({"error": str(e)})
    except WebSocketDisconnect:
        pass
