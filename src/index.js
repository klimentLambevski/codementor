import videojs from 'video.js';
import './app/components/settings-menu/settings-menu-button';
import './app/components/settings-menu/settings-menu-item';
import './app/components/quality-picker/quality-picker';
import './app/components/quality-picker/quality-menu-item';
import './app/components/quality-picker/quality-menu';
import './app/components/quality-picker/quality-picker-button';


import Hls from 'hls.js';
import HlsProvider from './app/components/quality-picker/hls-provider';

const SOURCE_SUPPORT = {
  MAYBE: 'maybe',
  NONE: '',
  PROBABLY: 'probably',
};

if (Hls.isSupported()) {
  videojs.getTech('Html5').registerSourceHandler({
    canHandleSource(source) {
      const hlsTypeRgxp = /^application\/x-mpegURL$/i;
      const hlsExtRgxp = /\.m3u8/i;

      if (hlsTypeRgxp.test(source.type)) {
        return SOURCE_SUPPORT.PROBABLY;
      } else if (hlsExtRgxp.test(source.src)) {
        return SOURCE_SUPPORT.MAYBE;
      }

      return SOURCE_SUPPORT.NONE;
    },

    handleSource(source, tech) {
      if (tech.hlsProvider) {
        tech.hlsProvider.dispose();
      }

      tech.hlsProvider = new HlsProvider(source, tech, Hls);
      return tech.hlsProvider;
    }
  });
} else {
  console.error('hls.js is not supported by your browser');
}

videojs.HlsProvider = HlsProvider;

require('./app/boot');


