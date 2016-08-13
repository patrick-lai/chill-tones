/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import $ from 'jquery';
import jQuery from 'jquery';
import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import s from './styles.css';
import { title, html } from './index.md';
import "jquery.ripples";
import lodash from "lodash";
import SC from "soundcloud";
import AtvImg from 'react-atv-img';

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
      inputUrl: soundFile
    };

    this.changeSong = this.changeSong.bind(this);
    this.playMusic = this.playMusic.bind(this);
  }

  static propTypes = {
    articles: PropTypes.array.isRequired,
  };b

  changeSong(event){
      this.setState({inputUrl: event.target.value});
  }

  getPathFromUrl(inputUrl){
    var paths = inputUrl.split("/");
    return "/users/"+paths[3]+"/tracks/"+paths[4];
  }

  setupAudio(myAudio){
     window.AudioContext = AudioContext || window.webkitAudioContext;
     var context = new AudioContext();
     window.analyser = context.createAnalyser();
     window.fbc_array = new Uint8Array(window.analyser.frequencyBinCount);

     var source = context.createMediaElementSource(myAudio);

     window.analyser.smoothingTimeConstant = 0.8;
     window.analyser.fftSize = 512;

     source.connect(analyser);
     source.connect(context.destination);
     window.analyser.connect(context.destination);

     window.frameLooper();
   }

  playMusic(event){

      if(window.needHumanInteraction){
        window.musicPlayer.play();
        setTimeout(function(){
          if(!window.musicPlayer.paused){
            window.needHumanInteraction = false;
          }
        },500)
      }

      var $this = this;
      SC.get(this.getPathFromUrl(this.state.inputUrl)).then(function(sound){

        // Put info at the top

        if(sound.streamable){

          $this.setState(...$this.state, {
            title: sound.title,
            artwork_url: sound.artwork_url,
            tag_list: sound.tag_list
          })

          window.musicPlayer.crossOrigin = "anonymous";
          window.musicPlayer.src = sound.stream_url+"?client_id=a05e7ac15e7bd3214c4bf157a43d5245";
          if(!window.analyser){
            $this.setupAudio(window.musicPlayer);
          }

          localStorage.setItem('soundUrl', $this.state.inputUrl);

          window.musicPlayer.load();
          window.musicPlayer.play();

        }else{
          alert("this file is not streamable");
        }
      });
  }

  componentWillMount() {
    const script = document.createElement("script");
    script.src = "https://code.getmdl.io/1.2.0/material.min.js";
    script.async = true;
    document.body.appendChild(script);
  }

  componentDidMount() {
    document.title = title;
    // $("ripple").show();
    $("ripple").ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.02,
      interactive: false
    });

    function putOneRandomRipple(randomPosition, dropSize, strength){
      var $el = $('ripple');
      var x = $el.outerWidth();
      var y = $el.outerHeight();
      if(randomPosition){
        x = Math.random() * $el.outerWidth();
        y = Math.random() * $el.outerHeight();
      }else{
        x = x/2;
        y = y/2;
      }
      var dropRadius = dropSize ? dropSize : 40;
      var str = strength ? strength : 0.04;
      $el.ripples('drop', x, y, dropRadius, str);
    }

    var options = {
      timing : 10,
      peakThreshold: 50
    };

    var theBeat = {};

     window.AudioContext = AudioContext || window.webkitAudioContext;
     window.requestAnimFrame = function() {
       return (
         window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function( /* function */ callback) {
           window.setTimeout(callback, 1000 / 60);
         }
       );
     }();

     function shouldTrigger(i){
       var thisThreshold = options.peakThreshold;

       if(i < 100){
         thisThreshold = thisThreshold / 2;
       }

       if(i < 50){
         thisThreshold = thisThreshold / 2;
       }

       return fbc_array[i] - lodash.min(theBeat[i].previousThresholds) > thisThreshold;
     }

     window.frameLooper = function(){
       // This makes it request next frame
       requestAnimFrame(window.frameLooper);
       window.analyser.getByteFrequencyData(window.fbc_array);

       var rippleStrength = -0.08;

       for(var i in window.fbc_array){

         if(theBeat[i] == undefined){
           theBeat[i] = {
             previousThresholds : []
           };
         }

        // Tighter lower frequencies, higher upper frequencies
        var shouldInclude = i%50 == 0 || (i < 50 && i%10 == 0) || (i < 10);

        // Check if the jump is big
        if(shouldTrigger(i) && shouldInclude){

            if( i < 100){
              rippleStrength += 0.03
            }else if (i < 200){
              rippleStrength += 0.02
            }else{
              rippleStrength += 0.01
            }

            theBeat[i].previousThresholds = [];
        }

        theBeat[i].previousThresholds.push(fbc_array[i]);

        if(theBeat[i].previousThresholds.length > options.timing ){
          theBeat[i].previousThresholds.shift();
        }

       }

       if(rippleStrength > 0){

         rippleStrength = rippleStrength > 0.5 ? 0.5 : rippleStrength;

         var dropSize = 20 + rippleStrength*200;
         dropSize = dropSize > 80 ? 80 : dropSize;

         putOneRandomRipple(true, dropSize , rippleStrength);
       }

     }

     // Setup sound
     window.musicPlayer = new Audio();
     window.musicPlayer.crossOrigin = "anonymous";
     window.musicPlayer.volume = 0.5;

     // Do some magic to make it loop more "seamless"
     window.musicPlayer.addEventListener('timeupdate', function(){
                    var startTime = 0.2;
                    // Raise this until it plays "seamlessly"
                    var buffer = 0.50;
                    if(this.currentTime > this.duration - buffer){
                        this.currentTime = startTime;
                        this.play();
                    }}, false);

    SC.initialize({
      client_id: 'a05e7ac15e7bd3214c4bf157a43d5245'
    });

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    // Play music a bit after load
    var $this = this;
    setTimeout(function(){
      $this.playMusic();
    }, 2000);

    if(isMobile.any()) {
      window.needHumanInteraction = true;
    }

    if(!(typeof(componentHandler) == 'undefined')){
        componentHandler.upgradeAllRegistered();
    }
  }

  setAndPlay = (thisSongUrl) => {
    var $this = this;
    this.setState({inputUrl: thisSongUrl});
    setTimeout(function(){
      $this.playMusic();
    }, 200);
  }

  render() {
    var $this = this;

    var recommendedSongs = [
      {
        name: "Prelude 20-5 (Raindrop) - Chopin",
        url: "https://soundcloud.com/calcatelli/celestial-chopin-raindrop-prelude-op-28-n-15-performed-on-a-celesta"
      },{
        name: "Emotions free - Mitis",
        url: "https://soundcloud.com/mitis/mitis-written-emotions-free"
      },{
        name: "Rameses B - Bae Bae",
        url: "https://soundcloud.com/mrsuicidesheep/rameses-b-bae-bae"
      },{
        name: "Dearest - Anime NZ",
        url: "https://soundcloud.com/dysan-aufar/my-dearest-piano-cov-animenz-ver"
      },{
        name: "Get F*cked Up EDM Electro House - Terence Chiminello",
        url: "https://soundcloud.com/terencechiminello/terence-chiminello-lets-get"
      }
    ];

    return (
      <Layout>
        <ripple style={mainStyle}>
          <div id="demo-menu-lower-left" style={{color: "white", textAlign: "center", width: "140px", margin: "10px", position: "relative", cursor : "pointer"}}>
            <AtvImg
                layers={[
                  $this.state.artwork_url
                ]}
                staticFallback={$this.state.artwork_url}
                isStatic={false}
                style={{ width: 100, height: 100, padding : "20px" }}
              />
            {$this.state.title}
            <img src="https://developers.soundcloud.com/assets/logo_big_white-65c2b096da68dd533db18b9f07d14054.png" style={{borderRadius : "50%", width: "40px", height : "40px", backgroundColor : "rgba(0,0,0,0.8)" , objectFit: "contain", position: "absolute", left: "5px", top: "5px"}}/>

          </div>

          <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
              htmlFor="demo-menu-lower-left">
              <li className="mdl-menu__item" style={{fontWeight: "bold"}}>Recommended Songs (Can put any soundcloud Url bottom right too)</li>
              {
                recommendedSongs.map((song, index) => (
                   <li key={song.name} className="mdl-menu__item" onClick={()=>this.setAndPlay(song.url)}>{song.name}</li>
                ))
              }
          </ul>

          <div style={{position: "fixed", bottom: "0", width: "100%", color: "white", padding: "0 10px"}}>
            <span style={{color: "white", lineHeight: "66px"}}> Audio Synced Droplets - by Patrick Lai</span>

            <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect" style={{float: "right", marginRight: "30px"}}  onClick={this.playMusic}>
              <i className="material-icons">play_arrow</i>
            </button>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style={{float: "right", width: "400px", marginRight: "10px"}}>
              <input className="mdl-textfield__input" type="text" id="inputUrl" value={$this.state.inputUrl} onChange={this.changeSong}/>
              <label className="mdl-textfield__label" htmlFor="inputUrl">SoundCloud Url</label>
            </div>

          </div>
        </ripple>
      </Layout>
    );
  }

}

export default HomePage;
