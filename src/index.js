import Vue from 'vue';
import {App} from './app/app';

new Vue({
  el: '#r-boot',
  data: {
    message: 'hello world'
  },
  components: {
    'app-component': App
  }
});

