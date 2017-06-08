import videojs from 'video.js';
import QualityPickerButton from './quality-picker-button';

function qualityPickerPlugin(options) {
  var player = this;
  var tech = this.tech_;


  console.log(this, 'sdfsdfsd', this.tech((t) => {
    console.log(t);
  }));
  setTimeout(() => {
    console.log('tech -->>>> ', this.tech_)
    this.tech_.on('loadedqualitydata', onQualityData);

  },100)

  let SUPPORTED_TRACKS = ["video", "audio", "subtitle"];
  let TRACK_CLASS = {
    video: 'vjs-icon-hd',
    audio: 'vjs-icon-cog',
    subtitle: 'vjs-icon-subtitles'
  };

  console.log(tech);
  function onQualityData(event, {qualityData, qualitySwitchCallback}) {

    var fullscreenToggle = player.controlBar.getChild('fullscreenToggle');
    player.controlBar.removeChild(fullscreenToggle);
    console.log('on quality data ->>>');
    for (var i=0; i < SUPPORTED_TRACKS.length; i++) {
      var track = SUPPORTED_TRACKS[i];
      var name = track + "PickerButton";
      var qualityPickerButton = player.controlBar.getChild(name);
      if (qualityPickerButton) {
        qualityPickerButton.dispose();
        player.controlBar.removeChild(qualityPickerButton);
      }

      if (qualityData[track] && qualityData[track].length > 1) {
        qualityPickerButton = new QualityPickerButton(player, {name, qualityList: qualityData[track], qualitySwitchCallback, trackType: track});
        qualityPickerButton.addClass(TRACK_CLASS[track]);

        player.controlBar.addChild(qualityPickerButton);
      }
    }

    if (fullscreenToggle) {
      player.controlBar.addChild(fullscreenToggle);
    }
  }
}

console.log('sdfsdf');

videojs.registerPlugin('qualityPickerPlugin', qualityPickerPlugin);