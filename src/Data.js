import React, { Component } from 'react'
import Layout from './Layout'
import * as _ from 'lodash'
import * as d3 from 'd3'

let algorithm_options = ['UMAP', 'T-SNE']
let algorithm_embedding_keys = [
  'bird_embedding',
  'tsne_mnist_embeddings'
]

class Data extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bird_embedding: null,
      mnist_labels: null,
    }
  }
  scaleEmbeddings(embeddings) {
    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;

    for (let i = 0; i < embeddings.length; i++) {
      let x = embeddings[i][0];
      let y = embeddings[i][1];

      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }

    let xRange = xMax - xMin;
    let yRange = yMax - yMin;
    let maxRange = Math.max(xRange, yRange);
    let xOffset = -0.5 * (xMax + xMin);
    let yOffset = -0.5 * (yMax + yMin);

    let scaled_embeddings = embeddings.map(e => [
      40 * (e[0] + xOffset) / maxRange,
      40 * (e[1] + yOffset) / maxRange,
    ]);

    return scaled_embeddings;
  }

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/bird_embedding.json`)
      .then(response => response.json())
      .then(bird_embedding => {
        let scaled_embeddings = this.scaleEmbeddings(bird_embedding)
        this.setState({
          bird_embedding: scaled_embeddings,
        })
      })
    fetch(`${process.env.PUBLIC_URL}/tsne_mnist_embeddings.json`)
      .then(response => response.json())
      .then(bird_embedding => {
        let scaled_embeddings = this.scaleEmbeddings(bird_embedding)
        this.setState({
          tsne_mnist_embeddings: scaled_embeddings,
        })
      })
    fetch(`${process.env.PUBLIC_URL}/mnist_labels.json`)
      .then(response => response.json())
      .then(mnist_labels =>
        this.setState({
          mnist_labels: mnist_labels,
        })
      )
  }

  render() {
    console.log(this.state)
    return this.state.bird_embedding && this.state.mnist_labels ? (
      <Layout
        {...this.state}
        algorithm_options={algorithm_options}
        algorithm_embedding_keys={algorithm_embedding_keys}
      />
    ) : (
      <div style={{ padding: '1rem' }}>Loading data...</div>
    )
  }
}

export default Data
