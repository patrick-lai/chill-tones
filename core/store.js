/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { createStore } from 'redux';
import * as types from './ActionTypes';

var soundFile = localStorage.getItem('songUrl');

if(!soundFile){
  soundFile = 'https://soundcloud.com/mitis/mitis-written-emotions-free';
  localStorage.setItem('songUrl', soundFile);
}

const initialStore = {
  songUrl: soundFile,
  volume: 70,
  appState: {
    title: null,
    artwork_url: null,
    tag_list: null
  }
};

// Centralized application state
// For more information visit http://redux.js.org/
const store = createStore((state, action) => {
  // TODO: Add action handlers (aka "reduces")
  switch (action.type) {
    case types.SET_SONG:
      localStorage.setItem('songUrl', action.songUrl);
      return {
        ...state,
        songUrl: action.songUrl
      };
    case types.SET_VOLUME:
      // Sets volume
      window.musicPlayer.volume = action.volume/100;
      return {
        ...state,
        volume: action.volume
      };
    case types.SET_STATE:
      return {
        ...state,
        appState: action.appState
      };
    default:
      return state;
  }
},initialStore);

export default store;
