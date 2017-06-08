import Vue from 'vue';
import videojs from 'video.js';


export const Player = Vue.extend({
  mounted() {
    videojs(this.$el, {
      'playbackRates': [0.5, 1, 1.5, 2],
      'qualityData': {
        video: {
          id: -1,
          label: 'auto',
          selected: true
        }
      },
      plugins:{
        qualityPickerPlugin: {

        }
      },
      controlBar: {
        children: {
          'playToggle':{},
          'muteToggle':{},
          'volumeControl':{},
          'currentTimeDisplay':{},
          'timeDivider':{},
          'durationDisplay':{},
          'liveDisplay':{},

          'flexibleWidthSpacer':{},
          'progressControl':{},


          'settingsMenuButton': {
            entries : [
              'subtitlesButton',
              'playbackRateMenuButton'
            ]
          },

          'fullscreenToggle':{}
        }
      }
    })
  },
  template: `<video
        id="my-player"
        class="video-js"
        controls
        preload="auto"
        poster="//vjs.zencdn.net/v/oceans.png"
        data-setup='{"nativeControlsForTouch": false}' 
        webkit-playsinline
        playsinline>
          <source src="//vjs.zencdn.net/v/oceans.mp4" type="video/mp4"></source>
          <source src="//vjs.zencdn.net/v/oceans.webm" type="video/webm"></source>
          <source src="//vjs.zencdn.net/v/oceans.ogv" type="video/ogg"></source>
          <p class="vjs-no-js">
              To view this video please enable JavaScript, and consider upgrading to a
              web browser that
              <a href="http://videojs.com/html5-video-support/" target="_blank">
                  supports HTML5 video
              </a>
          </p>
      </video>`,
});