import io
import base64
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import torch
import cv2
from PIL import Image
from torchvision import transforms
import sys
sys.path.insert(0, './CSRNet-pytorch')
from model import CSRNet

# ---------------- CONFIG ----------------
WEIGHTS_PATH = "./weights/73.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

TRANSFORM = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# ---------------- LOAD ----------------
def load_model():
    m = CSRNet().to(DEVICE)
    m.load_state_dict(torch.load(WEIGHTS_PATH, map_location=DEVICE))
    m.eval()
    return m

model = load_model()

# ---------------- IMAGE INFERENCE ----------------
def predict_image(pil_img: Image.Image) -> dict:
    img = pil_img.convert('RGB')
    tensor = TRANSFORM(img).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        density_map = model(tensor)

    density = density_map.squeeze().cpu().numpy()
    count = int(density.sum())

    # build heatmap as base64 png
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.imshow(density, cmap='jet')
    ax.axis('off')
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    buf.seek(0)
    heatmap_b64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

    return {
        "count": count,
        "heatmap_b64": heatmap_b64
    }

# ---------------- VIDEO INFERENCE ----------------
def predict_video(video_path: str, threshold: int) -> dict:
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS)) or 24
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    output_path = video_path.replace(".mp4", "_out.mp4")
    fourcc = cv2.VideoWriter_fourcc(*"avc1")
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    frame_id = 0
    frame_counts = []
    alert_text = "NORMAL"

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_id += 1

        if frame_id % 2 != 0:
            out.write(frame)
            continue

        img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        tensor = TRANSFORM(img).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            density_map = model(tensor)

        density = density_map.squeeze().cpu().numpy()
        count = density.sum()
        frame_counts.append({"frame": frame_id, "count": int(count)})

        norm_map = cv2.normalize(density, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        norm_map = cv2.resize(norm_map, (width, height))

        _, thresh = cv2.threshold(norm_map, 80, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        overlay = frame.copy()
        alert_text = "NORMAL"
        color = (0, 255, 0)

        if count > threshold:
            alert_text = "ALERT: CROWD LIMIT EXCEEDED"
            color = (0, 0, 255)

        for cnt in contours:
            if cv2.contourArea(cnt) > 200:
                cv2.drawContours(overlay, [cnt], -1, (0, 255, 0), 2)

        cv2.putText(overlay, f"Count: {int(count)}", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
        cv2.putText(overlay, alert_text, (20, 80),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

        out.write(overlay)

    cap.release()
    out.release()

    peak = max(f["count"] for f in frame_counts) if frame_counts else 0
    avg = round(sum(f["count"] for f in frame_counts) / len(frame_counts), 1) if frame_counts else 0

    return {
        "output_path": output_path,
        "frame_counts": frame_counts,
        "peak": peak,
        "avg": avg,
        "alert": alert_text
    }