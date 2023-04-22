import React from 'react'
import Markdown from 'react-remarkable'
import { about_text } from './Content'


const AboutPopup = ({ visible, onClose }) => {
  return (
    <div className={`popup-container ${visible ? 'visible' : ''}`} onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2>About This Project</h2>
        <div
          style={{
            color: '#fff',
          }}
        >
          <Markdown>{about_text}</Markdown>
        </div>
        <a href="https://github.com/your-github-repo"><button>GitHub Repo</button></a>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AboutPopup;