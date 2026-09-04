import h5py
import numpy as np
from PIL import Image

h5_path = "../data/raw/TheCycloneImageDataset/Cyclone_Images.h5"

with h5py.File(h5_path, 'r') as f:
    img = f['Images'][100].astype('float32')  # koi bhi index try kar sakte ho

img_3ch = img[:, :, :3]
img_3ch = np.clip(img_3ch, 0, 255).astype('uint8')

Image.fromarray(img_3ch).save("sample_test_image.jpg")
print("Sample image saved: sample_test_image.jpg")