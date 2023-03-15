import React, { Component } from 'react'

class Sidebar extends Component {
  componentDidMount() {
    this.props.setSidebarCanvas(this.side_canvas)
    this.handleSelectAlgorithm = this.handleSelectAlgorithm.bind(this)
  }

  handleSelectAlgorithm(e) {
    let v = e.target.value
    this.props.selectAlgorithm(v)
  }

  handleToggleProjection = () => {
    const { algorithm_choice, algorithm_options } = this.props;
    const numOptions = algorithm_options.length;
    const newChoice = (algorithm_choice + 1) % numOptions;
    this.props.selectAlgorithm(algorithm_options[newChoice])
  }

  render() {
    let {
      sidebar_orientation,
      sidebar_image_size,
      grem,
      p,
      hover_index,
      mnist_labels,
      color_array,
      algorithm_options,
      algorithm_choice,
    } = this.props

    return (
      <div class='sidebar'
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        <div>
          {' '}
          <div
            style={{
              display: 'flex',
              flexDirection:
                sidebar_orientation === 'horizontal' ? 'row' : 'column',
            }}
          >
            <div>
              <canvas
                ref={side_canvas => {
                  this.side_canvas = side_canvas
                }}
                class='side-img'
                width={sidebar_image_size}
                height={sidebar_image_size}
              />
            </div>


            <div style={{ flexGrow: 1 }}>
              <button
                class='toggle-projection'
                onClick={this.handleToggleProjection}
              >
                START
              </button>

              <div
                id="label"
                style={{
                  background: hover_index
                    ? `rgba(${color_array[mnist_labels[hover_index]].join(',')}, 0.8)` // NOTE This changes the color of the label in the sidebar
                    : 'transparent',
                  color: hover_index ? '#000' : '#fff',
                  padding: p(grem / 4, grem / 2),
                  display: 'flex',
                  justifyContent: 'space-between',
                  transition: 'all 0.1s linear',
                }}
              >
                <div>Label:</div>
                {hover_index ? <div>{mnist_labels[hover_index]}</div> : null}
              </div>
              <div
                style={{
                  padding: p(grem / 4, grem / 2),
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                Index:
                {hover_index ? <div>{hover_index}</div> : null}
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: grem / 2 }}>
          <div>
            An interactive UMAP visualization of the MNIST data set.{' '}
            <button
              onClick={() => {
                this.props.toggleAbout(true)
              }}
            >
              About
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Sidebar
