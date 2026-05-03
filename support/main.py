from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import tempfile
import os
from PIL import Image
import io

from csrnet import predict_image, predict_video

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- IMAGE ENDPOINT ----------------
@app.post("/predict/image")
async def image_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    pil_img = Image.open(io.BytesIO(contents))
    result = predict_image(pil_img)
    return {
        "count": result["count"],
        "heatmap_b64": result["heatmap_b64"]
    }

# ---------------- VIDEO ENDPOINT ----------------
@app.post("/predict/video")
async def video_endpoint(
    file: UploadFile = File(...),
    threshold: int = Form(50)
):
    # save uploaded video to a temp file
    suffix = os.path.splitext(file.filename)[-1] or ".mp4"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    shutil.copyfileobj(file.file, tmp)
    tmp.close()

    result = predict_video(tmp.name, threshold)

    return {
        "peak": result["peak"],
        "avg": result["avg"],
        "alert": result["alert"],
        "frame_counts": result["frame_counts"],
        "video_url": f"/video/{os.path.basename(result['output_path'])}",
        "output_path": result["output_path"]
    }

# ---------------- SERVE PROCESSED VIDEO ----------------
@app.get("/video/{filename}")
async def serve_video(filename: str):
    # find the file in temp dir
    path = os.path.join(tempfile.gettempdir(), filename)
    if not os.path.exists(path):
        return {"error": "File not found"}
    return FileResponse(path, media_type="video/mp4")