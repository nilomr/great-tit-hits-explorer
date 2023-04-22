import React, { Component } from 'react'
import Layout from './Layout'
import * as _ from 'lodash'
import * as d3 from 'd3'

let algorithm_options = ['UMAP', 'T-SNE']
let algorithm_embedding_keys = [
  'bird_embedding',
  'greti_embeddings'
]

class Data extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bird_embedding: null,
      greti_labels: null,
    }
  }
  scaleEmbeddings(embeddings, scale) {
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
      scale * (e[0] + xOffset) / maxRange,
      scale * (e[1] + yOffset) / maxRange,
    ]);

    return scaled_embeddings;
  }

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/greti_random.json`)
      .then(response => response.json())
      .then(bird_embedding => {
        let scaled_embeddings = this.scaleEmbeddings(bird_embedding, 60)
        this.setState({
          bird_embedding: scaled_embeddings,
        })
      })
    fetch(`${process.env.PUBLIC_URL}/greti_embeddings.json`)
      .then(response => response.json())
      .then(bird_embedding => {
        let scaled_embeddings = this.scaleEmbeddings(bird_embedding, 50)
        this.setState({
          greti_embeddings: scaled_embeddings,
        })
      })
    fetch(`${process.env.PUBLIC_URL}/greti_labels.json`)
      .then(response => response.json())
      .then(greti_labels =>
        this.setState({
          greti_labels: greti_labels,
        })
      )
  }

  render() {
    console.log(this.state)
    return this.state.bird_embedding && this.state.greti_labels ? (
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
