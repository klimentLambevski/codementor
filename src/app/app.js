import Vue from 'vue';

export const App = Vue.extend({
  props: ['hello'],
  template: '<h1>{{hello}}</h1>',
});