from typing import List, Tuple

import cv2
import matplotlib.pyplot as plt
import numpy as np


def load_image(image_path: str) -> np.ndarray:
    """
    Loads an image from the specified path.

    Args:
        image_path: Path of the image file to load.

    Returns:
        The loaded image as a NumPy array.
    """
    return cv2.imread(image_path)


def get_contour(image: np.ndarray) -> np.ndarray:
    """
    Finds the largest contour in the image.

    Args:
        image: The input image.

    Returns:
        The largest contour as a NumPy array.
    """
    image = cv2.flip(image, 0)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    mean, std = cv2.meanStdDev(gray)
    low_thresh = int(list(mean - (std * 1))[0][0])

    _, gray = cv2.threshold(gray, low_thresh, 255, cv2.THRESH_BINARY)
    edges = cv2.Canny(gray, low_thresh, 255)

    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    return max(contours, key=cv2.contourArea)


def get_bounding_box(contour: np.ndarray) -> Tuple[int, int, int, int]:
    """
    Computes the bounding box of the given contour.

    Args:
        contour: The input contour.

    Returns:
        The bounding box as a tuple of (x, y, width, height).
    """
    return cv2.boundingRect(contour)


def generate_coordinates(
    contour: np.ndarray, data_points: int
) -> List[Tuple[int, int]]:
    """
    Generates random points inside the given contour.

    Args:
        contour: The input contour.
        data_points: The number of points to generate.

    Returns:
        A list of generated points as tuples of (x, y).
    """
    x, y, w, h = get_bounding_box(contour)
    coordinates = []
    while len(coordinates) < data_points:
        point = (np.random.randint(x, x + w), np.random.randint(y, y + h))
        if cv2.pointPolygonTest(contour, point, False) > 0:
            coordinates.append(point)

    # center the coordinates around 0:
    x_mean = np.mean([x[0] for x in coordinates])
    y_mean = np.mean([x[1] for x in coordinates])
    coordinates = [(x[0] - x_mean, x[1] - y_mean) for x in coordinates]
    return coordinates


def plot_coordinates(coordinates: List[Tuple[int, int]]) -> None:
    """
    Plots the given coordinates as a scatter plot.

    Args:
        coordinates: The coordinates to plot as a list of tuples of (x, y).

    Returns:
        None
    """
    plt.figure(figsize=(10, 10))
    plt.scatter([x[0] for x in coordinates], [x[1] for x in coordinates], s=2)
    plt.show()


def coordinates_from_image(
    image_path: str, data_points: int, plot: bool = False
) -> List[List[int]]:
    """
    Generates random points inside the largest contour of the image.

    Args:
        image_path: Path of the image file to load.
        data_points: The number of points to generate.

    Returns:
        None
    """
    image = load_image(image_path)
    contour = get_contour(image)
    coordinates = generate_coordinates(contour, data_points)
    if plot:
        plot_coordinates(coordinates)
    return [list(i) for i in coordinates]
