import React, { Component } from 'react'
import AboutPopup from './About'

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

  constructor(props) {
    super(props);
    this.state = {
      showAbout: false,
    };
  }

  handleAboutButtonClick = () => {
    this.setState({ showAbout: true });
  }

  handlePopupClose = () => {
    this.setState({ showAbout: false });
  }

  render() {
    let {
      sidebar_orientation,
      sidebar_image_size,
      grem,
      p,
      hover_index,
      greti_labels,
      color_array,
      algorithm_options,
      algorithm_choice,
    } = this.props

    const { showAbout } = this.state;

    return (

      <div id='sidebar-inner'>

        <canvas
          ref={side_canvas => {
            this.side_canvas = side_canvas
          }}
          width={sidebar_image_size}
          height={sidebar_image_size}
          id='side-img'
        />
        <div id='main-buttons'>

          <div class="h-button-container">
            <button id='toggle-projection' onClick={this.handleToggleProjection}>Start</button>
            <div id='about-main'>
              <button onClick={this.handleAboutButtonClick}>About</button>
              <AboutPopup visible={this.state.showAbout} onClose={this.handlePopupClose} />
            </div>
          </div>

          <hr class='horizontal-divider' />
          <div class="v-button-container">
            <div
              id="label-id"
              style={{
                background: hover_index
                  ? `rgba(${color_array[greti_labels[hover_index]].join(',')}, 0.4)` // NOTE This changes the color of the label in the sidebar
                  : 'null', // set color here if you want a default color
                color: hover_index // ? '#000' : '#fff'
              }}
            >
              <div>Label:</div>
              {hover_index ? <div>{greti_labels[hover_index]}</div> : null}
            </div>
            <div id='index-id'>
              Index:
              {hover_index ? <div>{hover_index}</div> : null}
            </div>
          </div>
        </div>
      </div>



    )
  }
}

export default Sidebar
