# %%
from sklearn.datasets import fetch_openml
import PIL
import numpy
from PIL import Image
import math

mnist = fetch_openml("mnist_784")

# %%
ss_width = 2048
image_height = 28
image_width = 28

# %%
columns = math.floor(ss_width / image_width)

# %%
all_rows = []
for i in range(len(mnist.data)):
    if i % columns == 0:
        all_rows.append([])
    current = all_rows[len(all_rows) - 1]
    current.append(mnist.data.loc[i].values)

# %%
mnist.data
mnist.target

# %%
mnist.data.loc[i].values

# %%
len(all_rows)

# %%
ranges = []
for i in range(math.ceil(len(all_rows) / columns)):
    start = i * columns
    end = (i + 1) * columns
    if i == math.ceil(len(all_rows) / columns) - 1:
        end = len(all_rows)
    ranged = range(start, end)
    ranges.append(ranged)

# %%
ranges

# %%
leftover = 2048 % columns
row_padding = []
for i in range(leftover):
    row_padding.append(0)
row_padding

# %%
chunk_padding = []
for i in range(2048 - columns * image_height):
    chunk_padding.append([])
    current = chunk_padding[len(chunk_padding) - 1]
    for p in range(2048):
        current.append(0)
len(chunk_padding)

# %%
len(all_rows[0])

# %%
ss_width - len(ranges[0]) * image_height

# %%
import numpy as np
import array
from PIL import Image

for range_counter in range(len(ranges)):
    full_combined = []
    for r in ranges[range_counter]:
        row_digits = all_rows[r]
        reshaped = []
        for i in range(len(row_digits)):
            digit = row_digits[i]
            digit = np.resize(digit, (image_width, image_height))
            reshaped.append(digit)
        combined = []
        for i in range(image_height):
            combined.append([])
            current = combined[len(combined) - 1]
            for j in range(len(row_digits)):
                current.extend(reshaped[j][i])
            padding_needed = ss_width - len(row_digits) * image_width
            for p in range(padding_needed):
                current.append(0)
        full_combined.extend(combined)
    row_padding_needed = ss_width - len(full_combined)
    wtf = row_padding_needed
    for rp in range(row_padding_needed):
        current = []
        for p in range(ss_width):
            current.append(0)
        full_combined.append(current)
    test = full_combined
    rgba_combined = []
    for row in full_combined:
        rgba_combined.append([])
        current = rgba_combined[len(rgba_combined) - 1]
        for item in row:
            current.append((item, item, item, 255))
    rgba_combined = np.asarray(rgba_combined)
    rgba_combined = rgba_combined.astype(np.uint8)
    im = Image.fromarray(np.asarray(rgba_combined), mode="RGBA")
    name = "mnist_tile_solid_" + str(range_counter) + ".png"
    im.save(name)

# %%
for range_counter in range(len(ranges)):
    full_combined = []
    for r in ranges[range_counter]:
        row_digits = all_rows[r]
        reshaped = [np.resize(d, (image_width, image_height)) for d in row_digits]
        combined = [np.concatenate(reshaped, axis=1)]
        padding_needed = ss_width - combined[0].shape[1]
        combined[0] = np.pad(
            combined[0],
            ((0, 0), (0, padding_needed)),
            mode="constant",
            constant_values=0,
        )
        full_combined.extend(combined)
    padding_needed = ss_width - full_combined[-1].shape[1]
    full_combined[-1] = np.pad(
        full_combined[-1],
        ((0, 0), (0, padding_needed)),
        mode="constant",
        constant_values=0,
    )
    rgba_combined = np.repeat(np.expand_dims(full_combined, axis=2), repeats=4, axis=2)
    rgba_combined[..., :-1] = rgba_combined[..., 0:1]
    im = Image.fromarray(np.uint8(rgba_combined))
    name = f"mnist_tile_solid_{range_counter}.png"
    im.save(name)

# %%

for range_counter in range(len(ranges)):
    i = 0
    full_combined = []
    for r in ranges[range_counter]:
        print(r)
        row_digits = all_rows[r]
        if i > 2:
            break
# import matplotlib.pyplot as plt

# plt.imshow(full_combined)
# plt.show()


# %%
mnist.target[18378]

# %%
check = mnist.data[67620]
check = numpy.asarray(check)
check.resize(28, 28)
im = Image.fromarray(check, mode="L")
im

# %%
