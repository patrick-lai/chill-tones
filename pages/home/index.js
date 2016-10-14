/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import s from './styles.css';
import { title, html } from './index.md';
import AtvImg from 'react-atv-img';
import { connect } from 'react-redux';

// Components
import Layout from '../../components/Layout';
import MediaControls from '../../components/MediaControls';

// Actions and Data
import * as types from '../../core/ActionTypes';
import * as Songs from '../../core/Songs';
import * as Actions from '../../core/Actions';
import * as AudioRipple from './AudioRipple';

var mainStyle = {
  backgroundImage: "url('/images/bg.jpg')",
  backgroundSize: "cover",
  width: "100%",
  height: "100%",
  position: "fixed"
}

class HomePage extends React.Component {

  constructor(props) {
    super(props);

    var soundFile = localStorage.getItem('soundUrl');

    if(!soundFile){
      soundFile = 'https://soundcloud.com/mitis/mitis-written-emotions-free';
      localStorage.setItem('soundUrl', soundFile);
    }

    this.state = {
      inputUrl: soundFile,
      volume: 70
    };
  }

  static propTypes = {

  };

  getPathFromUrl(inputUrl){
    var paths = inputUrl.split("/");
    return "/users/"+paths[3]+"/tracks/"+paths[4];
  }

  componentWillMount() {
    const script = document.createElement("script");
    script.src = "https://code.getmdl.io/1.2.0/material.min.js";
    script.async = true;
    document.body.appendChild(script);
  }

  componentDidMount() {
    AudioRipple.setupAudioRipples();
  }

  setAndPlay = (thisSongUrl) => {
    Actions.setSong(thisSongUrl);
    Actions.play();
  }

  render() {
    var $this = this;

    return (
      <Layout>
        <ripple style={mainStyle}>
          <div id="demo-menu-lower-left" style={{color: "white", textAlign: "center", width: "140px", margin: "10px", position: "relative", cursor : "pointer"}}>
            <AtvImg
                layers={[
                  this.props.appState.artwork_url
                ]}
                staticFallback={this.props.appState.artwork_url}
                isStatic={false}
                style={{ width: 100, height: 100, padding : "20px" }}
              />
            {this.props.appState.title}
            <img src="https://developers.soundcloud.com/assets/logo_big_white-65c2b096da68dd533db18b9f07d14054.png" style={{borderRadius : "50%", width: "40px", height : "40px", backgroundColor : "rgba(0,0,0,0.8)" , objectFit: "contain", position: "absolute", left: "5px", top: "5px"}}/>

          </div>

          <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
              htmlFor="demo-menu-lower-left">
              <li className="mdl-menu__item" style={{fontWeight: "bold"}}>Recommended Songs (Can put any soundcloud Url bottom right too)</li>
              {
                Songs.default.map((song, index) => (
                   <li key={song.name} className="mdl-menu__item" onClick={()=>this.setAndPlay(song.url)}>{song.name}</li>
                ))
              }
          </ul>

          <MediaControls/>
        </ripple>
      </Layout>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    volume: state.volume,
    songUrl: state.songUrl,
    appState: state.appState
  };
}

export default connect(
  mapStateToProps
)(HomePage);
