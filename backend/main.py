from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
import json
import os
from PIL import Image
import io

app = FastAPI(title="Cyclone Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATHS = [
    "../ai-ml/models/resnet_dual_finetuned.keras",
    "../ai-ml/models/resnet_finetuned.h5",
]

def load_classification_model():
    for path in MODEL_PATHS:
        if os.path.exists(path):
            print(f"Loading model from: {path}")
            return tf.keras.models.load_model(path, compile=False)
    raise FileNotFoundError(f"Koi bhi model file nahi mili: {MODEL_PATHS}")

classification_model = load_classification_model()

with open("../ai-ml/data/processed/category_mapping.json") as f:
    mapping = json.load(f)

def predict_cyclone(img: Image.Image):
    img = img.convert("RGB").resize((224, 224))
    img_array = np.array(img).astype("float32")
    img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    prediction = classification_model.predict(img_array, verbose=0)

    if isinstance(prediction, dict):
        class_probs = prediction["classification"]
    elif isinstance(prediction, list):
        class_probs = prediction[0]
    else:
        class_probs = prediction

    pred_class = int(np.argmax(class_probs))
    confidence = float(np.max(class_probs))
    category_name = mapping["int_to_category"][str(pred_class)]

    return {
        "category": category_name,
        "confidence": round(confidence, 4)
    }

@app.get("/")
def root():
    return {"status": "Cyclone Prediction API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents))
    result = predict_cyclone(img)
    return result