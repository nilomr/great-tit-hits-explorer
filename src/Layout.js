import React, { Component } from 'react'
import Sidebar from './Sidebar'
import Projection from './Projection'
import AboutPopup from './About'
import * as _ from 'lodash'

// padding constructor
function p(tb, lr) {
  return `${tb}px ${lr}px`
}

let color_array = [
  [141, 211, 199],
  [255, 255, 179],
  [190, 186, 218],
  [251, 128, 114],
  [128, 177, 211],
  [253, 180, 98],
  [179, 222, 105],
  [252, 205, 229],
  [188, 128, 189],
  [204, 235, 197],
]

class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ww: null,
      wh: null,
      sidebar_height: null,
      hover_index: null,
      show_about: null,
      algorithm_choice: 0,
    }
    this.sidebar_ctx = null
    this.setSize = _.debounce(this.setSize.bind(this), 200)
    this.checkHash = this.checkHash.bind(this)
    this.setSidebarCanvas = this.setSidebarCanvas.bind(this)
    this.selectAlgorithm = this.selectAlgorithm.bind(this)
  }

  selectAlgorithm(v) {
    let i = this.props.algorithm_options.indexOf(v)
    this.setState({ algorithm_choice: i })
  }

  setSize() {
    this.setState({ ww: window.innerWidth, wh: window.innerHeight })
    let sidebar_height = this.sidebar_mount.offsetHeight
    this.setState({ sidebar_height: sidebar_height })
    if (this.sidebar_ctx) this.sidebar_ctx.imageSmoothingEnabled = false
  }

  setSidebarCanvas(canvas) {
    let ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    this.sidebar_ctx = ctx
  }

  setHoverIndex(hover_index) {
    this.setState({ hover_index: hover_index })
  }

  componentWillMount() {
    this.setSize()
    this.checkHash()
  }

  checkHash() {
    if (window.location.hash && window.location.hash === '#about') {
      this.setState({ show_about: true })
    } else {
      this.setState({ show_about: false })
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.setSize)
    window.addEventListener('popstate', this.checkHash)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setSize)
  }



  handleAboutButtonClick = () => {
    this.setState({ showAbout: true });
  }

  handlePopupClose = () => {
    this.setState({ showAbout: false });
  }

  render() {
    let {
      bird_embedding,
      greti_embeddings,
      md08_umap_greti_embeddings,
      greti_labels,
      algorithm_options,
      algorithm_embedding_keys,
    } = this.props
    let {
      ww,
      wh,
      hover_index,
      algorithm_choice,
    } = this.state

    const { showAbout } = this.state;
    let sidebar_ctx = this.sidebar_ctx
    let line_height = 1.5
    let scaler = 200 + (300 - 200) * ((ww - 768) / 600)
    let sidebar_style = {
      width: scaler,
    }

    let main_style = {
      width: ww,
      left: 0,
      height: wh,
    }

    let sidebar_image_size = sidebar_style.width
    let sidebar_orientation = 'vertical'
    let font_size = 16

    let grem = font_size * line_height

    return ww !== null ? (
      <div id='general' >
        <div id='sidebar'
          ref={sidebar_mount => {
            this.sidebar_mount = sidebar_mount
          }}
        >
          <Sidebar
            sidebar_orientation={sidebar_orientation}
            sidebar_image_size={sidebar_image_size}
            grem={grem}
            p={p}
            color_array={color_array}
            setSidebarCanvas={this.setSidebarCanvas}
            hover_index={hover_index}
            greti_labels={greti_labels}
            algorithm_options={algorithm_options}
            algorithm_choice={algorithm_choice}
            selectAlgorithm={this.selectAlgorithm}
          />
        </div>

        <div id='main' style={main_style} >
          <Projection
            width={main_style.width}
            height={main_style.height}
            bird_embedding={bird_embedding}
            greti_embeddings={greti_embeddings}
            md08_umap_greti_embeddings={md08_umap_greti_embeddings}
            greti_labels={greti_labels}
            color_array={color_array}
            sidebar_ctx={sidebar_ctx}
            sidebar_image_size={sidebar_image_size}
            setHoverIndex={this.setHoverIndex.bind(this)}
            algorithm_embedding_keys={algorithm_embedding_keys}
            algorithm_choice={algorithm_choice}
          />
        </div>

        <footer>
          <div class="footer-container">
            <p>An interactive visualization of the Wytham great tit dataset.</p>
            <p>© <a href="https://nilomr.github.io" target="_blank">Nilo Merino Recalde</a> 2023 | based on work by <a href="https://grantcuster.com" target="_blank">Grant Custer</a></p>
          </div>
        </footer>



      </div >
    ) : (
      <div style={{ padding: '1rem' }}>Loading layout...</div>
    )
  }
}

export default Layout
