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
    let xs = embeddings.map(e => Math.abs(e[0]))
    let ys = embeddings.map(e => Math.abs(e[1]))
    let max_x = _.max(xs)
    let max_y = _.max(ys)
    let max = Math.max(max_x, max_y)
    let scale = d3
      .scaleLinear()
      .domain([-max, max])
      .range([-20, 20])
    let scaled_embeddings = embeddings.map(e => [scale(e[0]), scale(e[1])])
    return scaled_embeddings
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
    fetch(`${process.env.PUBLIC_URL}/md08_umap_mnist_embeddings.json`)
      .then(response => response.json())
      .then(bird_embedding => {
        let scaled_embeddings = this.scaleEmbeddings(bird_embedding)
        console.log('got em')
        this.setState({
          md08_umap_mnist_embeddings: scaled_embeddings,
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
