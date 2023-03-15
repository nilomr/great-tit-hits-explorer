# %% [markdown]
#
# UMAP on the MNIST Digits dataset
# --------------------------------
#
# A simple example demonstrating how to use UMAP on a larger
# dataset such as MNIST. We first pull the MNIST dataset and
# then use UMAP to reduce it to only 2-dimensions for
# easy visualisation.
#
# Note that UMAP manages to both group the individual digit
# classes, but also to retain the overall global structure
# among the different digit classes -- keeping 1 far from
# 0, and grouping triplets of 3,5,8 and 4,7,9 which can
# blend into one another in some cases.
#
#

# %%
from sklearn.datasets import fetch_openml
import json
from pathlib import Path

mnist = fetch_openml("mnist_784")

out_dir = Path("public")

# %%
import umap
import matplotlib.pyplot as plt
import seaborn as sns


sns.set(context="paper", style="white")

reducer = umap.UMAP(random_state=42, min_dist=0.8)
embedding = reducer.fit_transform(mnist.data)

fig, ax = plt.subplots(figsize=(12, 10))
plt.scatter(embedding[:, 0], embedding[:, 1], c=mnist.target, cmap="Spectral", s=0.1)
plt.setp(ax, xticks=[], yticks=[])
plt.title("MNIST data embedded into two dimensions by UMAP 0.8", fontsize=18)


# %%
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt
import seaborn as sns

sns.set(context="paper", style="white")

tsne = TSNE(n_components=2, random_state=0)
embedding = tsne.fit_transform(mnist.data)

fig, ax = plt.subplots(figsize=(12, 10))
plt.scatter(embedding[:, 0], embedding[:, 1], c=mnist.target, cmap="Spectral", s=0.1)
plt.setp(ax, xticks=[], yticks=[])
plt.title("MNIST data embedded into two dimensions by TSNE", fontsize=18)


# %%
reducer = umap.UMAP(random_state=42)
embedding = reducer.fit_transform(mnist.data)


with open("mnist-embeddings.json", "w") as outfile:
    json.dump(embedding.tolist(), outfile)


# %%

from make_silhouette import coordinates_from_image


embedding = coordinates_from_image("./public/bird.png", len(mnist.data), plot=True)

with open(out_dir / "bird_embedding.json", "w") as outfile:
    json.dump(embedding, outfile)


# %%
tsne = TSNE(n_components=2, random_state=0)
embedding = tsne.fit_transform(mnist.data)
import json

with open("tsne-mnist-embeddings.json", "w") as outfile:
    json.dump(embedding.tolist(), outfile)
