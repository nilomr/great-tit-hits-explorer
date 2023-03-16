import json
from pathlib import Path
from typing import List, Tuple

import cv2
import matplotlib.pyplot as plt
import numpy as np


def load_image(image_path: Path) -> np.ndarray:
    """
    Load an image from a given file path.

    Args:
        image_path: A path object representing the file path of the image.

    Returns:
        An NumPy ndarray representing the loaded image.
    """
    image = cv2.imread(str(image_path))
    image = cv2.flip(image, 0)
    return image


def compute_masked_points(image: np.ndarray, data_points: int) -> np.ndarray:
    """
    Generate random floating point numbers within the canvas of the same size as
    the input image and keep only those that fall in the black regions of the
    input image.

    Args:
        image: A NumPy ndarray representing the input image. data_points: An
            integer representing the desired number of data points to be generated.

    Returns:
        A NumPy ndarray representing the masked data points.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Compute the mean and standard deviation of the grayscale image
    mean, std = cv2.meanStdDev(gray)
    low_thresh = int(list(mean - (std * 1))[0][0])

    # Threshold the grayscale image to obtain a binary mask
    _, mask = cv2.threshold(gray, low_thresh, 255, cv2.THRESH_BINARY)

    h, w = mask.shape
    masked_points = []
    while len(masked_points) < data_points:
        x = np.random.uniform(0, w, data_points - len(masked_points))
        y = np.random.uniform(0, h, data_points - len(masked_points))
        points = np.column_stack((x, y))
        masked_points += list(points[mask[y.astype(int), x.astype(int)] == 0])

    masked_points = np.array(masked_points)

    # If the number of points left after masking is greater than the desired data points, randomly select a subset
    if masked_points.shape[0] > data_points:
        masked_points = masked_points[
            np.random.choice(masked_points.shape[0], data_points, replace=False)
        ]

    # Scale the data points to be between -50 and 50, centered around 0
    # masked_points = (masked_points - masked_points.mean()) / masked_points.std() * 50

    return masked_points


def plot_points(points: np.ndarray) -> None:
    """
    Plot the generated points.

    Args:
        points: A NumPy ndarray representing the points to be plotted.

    Returns:
        None.
    """
    plt.figure(figsize=(10, 10))
    plt.scatter(points[:, 0], points[:, 1], s=1)
    plt.show()


def save_points_to_json(points: np.ndarray, out_path: Path) -> None:
    """
    Save the generated points to a JSON file.

    Args:
        points: A NumPy ndarray representing the points to be saved.
        out_path: A Path object representing the file path of the output JSON
            file.

    Returns:
        None.
    """
    with open(out_path, "w") as outfile:
        json.dump(points.tolist(), outfile)


if __name__ == "__main__":
    # Define the input image path and the number of desired data points
    root = Path(__file__).parent
    image_path = root / "public" / "bird.png"
    data_points = 70000

    image = load_image(image_path)
    points = compute_masked_points(image, data_points)
    plot_points(points)
    save_points_to_json(points, root / "public" / "bird_embedding.json")
