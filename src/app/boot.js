import Vue from 'vue';
import {App} from './app';
import {Player} from './components/player';

new Vue({
  el: '#r-boot',
  data: {
    message: 'hello world'
  },
  components: {
    'app-component': App,
    'player': Player
  }
});