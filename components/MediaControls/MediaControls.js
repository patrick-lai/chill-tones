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
import history from '../../core/history';
import { connect } from 'react-redux';
import Songs from '../../core/Songs';
import * as Actions from '../../core/Actions';
import Config from '../../core/config';

class MediaControls extends React.Component {

  constructor(props) {
    super(props);

    var soundFile = localStorage.getItem('soundUrl');

    if(!soundFile){
      soundFile = 'https://soundcloud.com/mitis/mitis-written-emotions-free';
      localStorage.setItem('soundUrl', soundFile);
    }

  }

  static propTypes = {

  };

  stopMusic(){
   Actions.pause();
  }

  setVolume(event){
    var newVolume =  event.target.value;
    Actions.setVolume(newVolume);
  }

  playMusic(){
    Actions.play()
  }

  changeSong(event){
    Actions.setSong(event.target.value);
  }

  componentDidMount() {

    SC.initialize({
      client_id: Config.client_id
    });

    var soundFile = localStorage.getItem('soundUrl');

    if(!soundFile){
      soundFile = Songs[0].url;
      localStorage.setItem('soundUrl', soundFile);
    }
    // Load song
    Actions.setSong(soundFile);
  }

  render() {

    return(
      <div style={{position: "fixed", bottom: "0", width: "100%", color: "white", padding: "0 10px"}}>

        <div>
          <span style={{color: "white", lineHeight: "66px"}}> Audio Synced Droplets - by Patrick Lai</span>
          <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect" style={{float: "right", marginRight: "30px"}}  onClick={this.stopMusic}>
            <i className="material-icons">stop_arrow</i>
          </button>
          <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect" style={{float: "right", marginRight: "10px"}}  onClick={this.playMusic}>
            <i className="material-icons">play_arrow</i>
          </button>
          <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style={{float: "right", width: "400px", marginRight: "10px"}}>
            <input className="mdl-textfield__input" type="text" id="inputUrl" value={this.props.songUrl} onChange={this.changeSong}/>
            <label className="mdl-textfield__label" htmlFor="inputUrl">SoundCloud Url</label>
          </div>
        </div>

        <div>
            <p style={{width: "590px", position: "absolute", bottom: "50px", right: "10px"}}>
              <label style={{marginLeft: "26px"}}>Volume</label>
              <input className="mdl-slider mdl-js-slider" id="volumeSlider" type="range" min="0" max="100" onChange={this.setVolume} value={this.props.volume}/>
            </p>
        </div>

      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    volume: state.volume,
    songUrl: state.songUrl
  };
}

export default connect(
  mapStateToProps
)(MediaControls);
