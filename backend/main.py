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

with open("../ai-ml/data/processed/regression_norm_params.json") as f:
    norm_params = json.load(f)

def denormalize(value, min_key, max_key):
    return value * (norm_params[max_key] - norm_params[min_key]) + norm_params[min_key]

def predict_cyclone(img: Image.Image):
    img = img.convert("RGB").resize((224, 224))
    img_array = np.array(img).astype("float32")
    img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    prediction = classification_model.predict(img_array, verbose=0)

    if isinstance(prediction, dict):
        class_probs = prediction["classification"]
        regression_output = prediction["regression"]
    elif isinstance(prediction, list):
        class_probs = prediction[0]
        regression_output = prediction[1]
    else:
        class_probs = prediction
        regression_output = None

    pred_class = int(np.argmax(class_probs))
    confidence = float(np.max(class_probs))
    category_name = mapping["int_to_category"][str(pred_class)]

    result = {
        "category": category_name,
        "confidence": round(confidence, 4)
    }

    if regression_output is not None:
        wind_norm = float(regression_output[0][0])
        pressure_norm = float(regression_output[0][1])

        wind_speed = denormalize(wind_norm, "wind_min", "wind_max")
        pressure = denormalize(pressure_norm, "pressure_min", "pressure_max")

        result["wind_speed_kmh"] = round(wind_speed, 2)
        result["central_pressure_hpa"] = round(pressure, 2)

    return result

@app.get("/")
def root():
    return {"status": "Cyclone Prediction API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents))
    result = predict_cyclone(img)
    return result


from fastapi.responses import StreamingResponse
import matplotlib.pyplot as plt

# ---------- Grad-CAM Setup (ek baar startup pe hota hai) ----------

def find_layer_by_type(model, layer_type, index=0):
    matches = [l for l in model.layers if isinstance(l, layer_type)]
    return matches[index]

resnet_submodel = classification_model.get_layer("resnet50")
last_conv_layer = resnet_submodel.get_layer("conv5_block3_out")
resnet_grad_model = tf.keras.models.Model(
    inputs=resnet_submodel.input, outputs=last_conv_layer.output
)

gap_layer = find_layer_by_type(classification_model, tf.keras.layers.GlobalAveragePooling2D)
dense_layer = find_layer_by_type(classification_model, tf.keras.layers.Dense, index=0)
dropout_layer = find_layer_by_type(classification_model, tf.keras.layers.Dropout, index=0)
classification_layer = classification_model.get_layer("classification")


def make_gradcam_heatmap(img_array):
    with tf.GradientTape() as tape:
        conv_outputs = resnet_grad_model(img_array)
        tape.watch(conv_outputs)
        x = gap_layer(conv_outputs)
        x = dense_layer(x)
        x = dropout_layer(x, training=False)
        predictions = classification_layer(x)
        pred_index = tf.argmax(predictions[0])
        class_channel = predictions[:, pred_index]

    grads = tape.gradient(class_channel, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-8)
    return heatmap.numpy(), int(pred_index.numpy())


def overlay_heatmap(img_display, heatmap, alpha=0.4):
    heatmap_resized = tf.image.resize(heatmap[..., np.newaxis], (224, 224)).numpy().squeeze()

    jet = plt.colormaps["jet"]
    jet_colors = jet(np.arange(256))[:, :3]
    jet_heatmap = jet_colors[np.uint8(255 * heatmap_resized)]

    superimposed = jet_heatmap * alpha + img_display * (1 - alpha)
    superimposed = np.clip(superimposed, 0, 1)
    return superimposed


@app.post("/gradcam")
async def gradcam(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
    img_display = np.array(img).astype("float32") / 255.0

    img_array = np.array(img).astype("float32")
    img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    heatmap, pred_class = make_gradcam_heatmap(img_array)
    overlay = overlay_heatmap(img_display, heatmap)

    overlay_img = Image.fromarray((overlay * 255).astype("uint8"))
    buf = io.BytesIO()
    overlay_img.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")