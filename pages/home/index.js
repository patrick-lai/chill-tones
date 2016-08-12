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

var mainStyle = {
  backgroundImage: "url('/images/bg.jpg')",
  backgroundSize: "cover",
  width: "100%",
  height: "100%",
  position: "fixed"
}

class HomePage extends React.Component {

  static propTypes = {
    articles: PropTypes.array.isRequired,
  };

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

    // Setup audio beater
    var userFunction;

    var options = {
      timing : 10,
      peakThreshold: 60
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

     var context = new AudioContext();
     var analyser = context.createAnalyser();
     var fbc_array = new Uint8Array(analyser.frequencyBinCount);

     function shouldTrigger(i){
       var thisThreshold = options.peakThreshold;

       if(i < 100){
         thisThreshold = thisThreshold / 2.5;
       }

       return fbc_array[i] - lodash.min(theBeat[i].previousThresholds) > thisThreshold;
     }

     function frameLooper(){
       // This makes it request next frame
       requestAnimFrame(frameLooper);
       analyser.getByteFrequencyData(fbc_array);

       for(var i in fbc_array){

         if(theBeat[i] == undefined){
           theBeat[i] = {
             previousThresholds : []
           };
         }

        // Tighter lower frequencies, higher upper frequencies
        var shouldInclude = i%150 == 0;

        // Check if the jump is big
        if(shouldTrigger(i) && shouldInclude){

            if( i < 100){
              putOneRandomRipple(true, 80 , 0.08);
            }else if (i < 200){
              putOneRandomRipple(true, 20 ,0.05);
            }else{
              putOneRandomRipple(true, 5 ,0.02);
            }

            theBeat[i].previousThresholds = [];
        }

        theBeat[i].previousThresholds.push(fbc_array[i]);

        if(theBeat[i].previousThresholds.length > options.timing ){
          theBeat[i].previousThresholds.shift();
        }

       }

     }

     function initAudio(myAudio, fn){
       window.AudioContext = AudioContext || window.webkitAudioContext;
       context = new AudioContext();
       userFunction = fn;
       analyser = context.createAnalyser();
       fbc_array = new Uint8Array(analyser.frequencyBinCount);

       var source = context.createMediaElementSource(myAudio);

       analyser.smoothingTimeConstant = 0.8;
       analyser.fftSize = 512;

       source.connect(analyser);
       source.connect(context.destination);
       analyser.connect(context.destination);

       frameLooper();
     }

     // Setup Heartbeatb
     var musicFile = "/sound/chihiro.mp3";
     var musicPlayer = new Audio(musicFile);

     // Do some magic to make it loop more "seamless"
     musicPlayer.addEventListener('timeupdate', function(){
                    var startTime = 0.2;
                    // Raise this until it plays "seamlessly"
                    var buffer = 0.50;
                    if(this.currentTime > this.duration - buffer){
                        this.currentTime = startTime;
                        this.play();
                    }}, false);


     initAudio(musicPlayer)

    musicPlayer.play();

  }

  render() {
    return (
      <Layout>
        <ripple style={mainStyle}>
          <span style={{position: "fixed", bottom : "10px", left: "10px", color: "white"}}>Real Time Audio Effects - Patrick Lai</span>
        </ripple>
      </Layout>
    );
  }

}

export default HomePage;
