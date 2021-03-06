// Bunch of actions

import * as types from "./ActionTypes";
import Store from "./store";
import SC from "soundcloud";
import Config from "./config";

export function setVolume(volume) {
  Store.dispatch({
    type: types.SET_VOLUME,
    volume: volume,
  });
}

export function setSong(songUrl) {
  Store.dispatch({
    type: types.SET_SONG,
    songUrl: songUrl,
  });

  this.play();
}

export function getPathFromUrl(songUrl) {
  var paths = songUrl.split("/");
  return "/users/" + paths[3] + "/tracks/" + paths[4];
}

export function play() {
  var setupAudio = (myAudio) => {
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
  };

  if (window.needHumanInteraction) {
    window.musicPlayer.play();
    setTimeout(function () {
      if (!window.musicPlayer.paused) {
        window.needHumanInteraction = false;
      }
    }, 500);
  }

  if (!Store.getState() || !Store.getState().songUrl) return;

  console.log("@@", Store.getState().songUrl);

  SC.resolve(Store.getState().songUrl).then(({ id }) => {
    SC.get("/tracks/" + id).then(function (sound) {
      // Put info at the top

      if (sound.streamable) {
        Store.dispatch({
          type: types.SET_STATE,
          appState: {
            title: sound.title,
            artwork_url: sound.artwork_url,
            tag_list: sound.tag_list,
          },
        });

        window.musicPlayer.crossOrigin = "anonymous";
        window.musicPlayer.src =
          sound.stream_url + "?client_id=" + Config.client_id;
        if (!window.analyser) {
          setupAudio(window.musicPlayer);
        }

        localStorage.setItem("soundUrl", Store.getState().songUrl);

        window.musicPlayer.load();
        window.musicPlayer.play();
      } else {
        alert("this file is not streamable");
      }
    });
  });
}

export function pause() {
  window.musicPlayer.pause();
}
