# CrowdSense — Real-Time Crowd Density Estimation

A web-based crowd density estimation system built on CSRNet (VGG-16 backbone, trained on ShanghaiTech Part B, MAE 9.43). Upload an image or video and get instant headcount, density heatmaps, threshold alerts, and exportable CSV analytics.

![Demo](others/demo.gif)

## Contributors
Group [6] — CSE468, North South University

- Rulia Akter Eti
- Rakibul Islam Regan
- Al-Af Muktadir
- Md. Mashrur Reza

---

## How It Works

CSRNet has two components:

- **Frontend** — first 10 layers of VGG-16 pretrained on ImageNet. Handles feature extraction.
- **Backend** — dilated convolutional layers (rates 1,2,2,2). Captures crowd density at multiple scales without losing spatial resolution.

The model outputs a 2D density map where summing all pixel values gives the estimated head count. This avoids drawing bounding boxes around individuals, which breaks down in dense crowds.

---

## Results

| Method | MAE |
|---|---|
| MCNN | 26.4 |
| CSRNet (original paper) | 10.6 |
| CrowdSense (ours) | **9.43** |

> Trained on ShanghaiTech Part B with fixed sigma (σ=15) density maps.

---

## Quick Start

### Main Demo (no training needed)

Open `main.ipynb` in Google Colab and run all cells top to bottom.

1. Installs dependencies and clones CSRNet repo
2. Downloads ShanghaiTech Part B dataset
3. Downloads pretrained weights (epoch 73, MAE 9.43)
4. Loads the model
5. Launches a Gradio video demo with a public shareable link

> Enable GPU: Runtime → Change runtime type → T4 GPU

---

### Full Web App

**Backend:**
```bash
cd support
uvicorn main:app --reload
```

**Frontend:**
```bash
cd support/frontend
npm install
npm run dev
```
Then open http://localhost:5173

---

### Train from Scratch (optional)

Open `support/training.ipynb` in Google Colab and run all cells:

1. Mount Google Drive for checkpoint storage
2. Generate density maps from head annotations (~2 mins)
3. Patch dataset.py paths and configure training
4. Train for 75 epochs (~5 hours on T4)
5. Load best checkpoint and run image demo

---

## Dataset

[ShanghaiTech Part B](https://www.kaggle.com/datasets/tthien/shanghaitech)

- 716 training images, 316 test images
- Ground truth: (x, y) head coordinate annotations in .mat files
- Density maps generated using Gaussian filter with σ=15
- Chosen over Part A for street-level moderate density scenes

---

## Model Weights

Pretrained checkpoint (epoch 73, MAE 9.43):  
[Download from Google Drive](https://drive.google.com/file/d/1tV51fSwKoago3fbwowlXlWDnJsHcgyrY/view?usp=sharing)

---

## Project Structure
main.ipynb              ← entry point, video inference + Gradio demo
README.md
requirements.txt
data/                   ← ShanghaiTech Part B dataset
support/
├── training.ipynb      ← train from scratch
├── csrnet.py           ← model load + inference functions
├── main.py             ← FastAPI backend
└── frontend/           ← React + Vite + Tailwind web app
others/
├── final_report.pdf
├── final_presentation.pptx
├── update_report.pdf
├── update_presentation.pptx
└── demo_video.mp4

---

## Limitations

- Works best on overhead/surveillance style images
- Front-facing crowd photos give unreliable counts
- Video processing is slow on CPU — a 5s clip takes ~2 mins locally
- Trained only on ShanghaiTech Part B — may not generalize to different crowd scenarios

---

## Base Implementation

Built on top of [CommissarMa/CSRNet-pytorch](https://github.com/CommissarMa/CSRNet-pytorch).  
Original paper: [CSRNet: Dilated Convolutional Neural Networks for Understanding the Highly Congested Scenes](https://arxiv.org/abs/1802.10062)