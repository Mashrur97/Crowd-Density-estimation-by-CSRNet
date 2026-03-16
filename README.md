# CSRNet Crowd Density Estimator

Crowd density estimation using CSRNet on the ShanghaiTech Part B dataset. Given a crowd image, the model outputs a density heatmap and an estimated head count.

![Demo](demo_placeholder.png)

## Demo

Upload any crowd image and get an estimated count + density heatmap instantly.

> Best results with overhead/surveillance style images.

---

## How It Works

CSRNet has two components:

- **Frontend** — first 13 layers of VGG-16 pretrained on ImageNet. Handles feature extraction.
- **Backend** — dilated convolutional layers. Captures crowd density at multiple scales without losing spatial resolution.

The model outputs a 2D density map where summing all pixel values gives the estimated head count. This avoids drawing bounding boxes around individuals, which breaks down in dense crowds.

---

## Results

| Dataset | MAE | MSE |
|---|---|---|
| ShanghaiTech Part B | 9.43 | — |

> Original CSRNet paper reports MAE of 10.6 on Part B.  
> Our result uses fixed sigma (σ=15) density maps vs adaptive sigma in the paper — not a direct comparison.

---

## Quick Start

### Requirements
- Google Colab with T4 GPU
- Google Drive (for checkpoint storage)

### Run the demo (no training needed)

Open `CSRNet_Final.ipynb` in Google Colab and run **Section A only** (cells A1–A5).

This will:
1. Install dependencies and clone the repo
2. Download the ShanghaiTech Part B dataset
3. Download pretrained weights (epoch 73, MAE 9.43)
4. Load the model
5. Launch a Gradio demo with a public shareable link

---

### Train from scratch (optional)

Run **Section B** in `CSRNet_Final.ipynb`:

1. Mount Google Drive
2. Generate density maps from head annotations (~2 mins)
3. Configure and run training (75 epochs, ~5 hours on T4)
4. Checkpoints saved to Drive automatically

Then run **Section C** to load your best checkpoint and launch the demo.

---

## Dataset

[ShanghaiTech Part B](https://www.kaggle.com/datasets/tthien/shanghaitech)

- 400 training images, 316 test images
- Ground truth: (x, y) head coordinate annotations in .mat files
- Density maps generated using Gaussian filter with σ=15

---

## Model Weights

Pretrained checkpoint (epoch 73, MAE 9.43):  
[Download from Google Drive](https://drive.google.com/file/d/1tV51fSwKoago3fbwowlXlWDnJsHcgyrY/view?usp=sharing)

---

## Project Structure

```
CSRNet-pytorch/
├── model.py          # CSRNet architecture
├── dataset.py        # Dataloader
├── train.py          # Training loop
├── config.py         # Training config
└── utils.py          # Helper functions

CSRNet_Final.ipynb    # Main notebook (demo + training)
README.md
```

---

## Base Implementation

Built on top of [CommissarMa/CSRNet-pytorch](https://github.com/CommissarMa/CSRNet-pytorch).  
Original paper: [CSRNet: Dilated Convolutional Neural Networks for Understanding the Highly Congested Scenes](https://arxiv.org/abs/1802.10062)

---

## Limitations

- Works best on overhead/surveillance style images
- Front-facing crowd photos give unreliable counts
- Trained only on ShanghaiTech Part B — may not generalize to very different crowd scenarios
