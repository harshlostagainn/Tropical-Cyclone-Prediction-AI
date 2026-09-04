import tensorflow as tf
import numpy as np
import json
import os
from PIL import Image

MODEL_PATHS = [
    "../models/resnet_dual_finetuned.keras",
    "../models/resnet_finetuned.h5",
]

def load_classification_model():
    for path in MODEL_PATHS:
        if os.path.exists(path):
            print(f"Loading model from: {path}")
            return tf.keras.models.load_model(path, compile=False)
    raise FileNotFoundError(f"Koi bhi model file nahi mili. Check kiya: {MODEL_PATHS}")

classification_model = load_classification_model()

with open("../data/processed/category_mapping.json") as f:
    mapping = json.load(f)

def predict_cyclone(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img).astype("float32")
    img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    prediction = classification_model.predict(img_array, verbose=0)

    # Model dual hai toh dictionary output aa sakta hai (classification + regression)
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

if __name__ == "__main__":
    import sys
    result = predict_cyclone(sys.argv[1])
    print(json.dumps(result, indent=2))