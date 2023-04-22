import json
from pathlib import Path

import numpy as np


root = Path(__file__).parent
image_path = root / "public" / "bird.png"

# read the 'greti_labels.json' file and count the number of labels:
with open(root / "public" / "greti_labels.json", "r") as f:
    labels = json.load(f)
    nlabs = len(labels)


with open(root / "public" / "greti_random.json", "w") as f:
    json.dump((0 + 4 * np.random.randn(nlabs, 2)).tolist(), f)
