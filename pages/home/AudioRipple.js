// Audio setups

import $ from 'jquery';
import jQuery from 'jquery';
import "jquery.ripples";
import { title, html } from './index.md';
import lodash from "lodash";

export function setupAudioRipples(){
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

  if(isMobile.any()) {
    window.needHumanInteraction = true;
  }

  if(!(typeof(componentHandler) == 'undefined')){
      componentHandler.upgradeAllRegistered();
  }
}
