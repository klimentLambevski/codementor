const VIDEOJS_EVENTS = {
  ON_ERROR: 'error',
  ON_WAITING: 'waiting',
  ON_LOADED_QUALITY_DATA: 'loadedqualitydata',
};

export default class HlsProvider {
  constructor(source, tech, Hls) {
    this.source = source;
    this.tech = tech;
    this.tech.name = 'HlsSourceHandler';

    this.video = tech.el();
    this.video.addEventListener(VIDEOJS_EVENTS.ON_ERROR, this.onVideoJSWaiting.bind(this));
    this.video.addEventListener(VIDEOJS_EVENTS.ON_WAITING, this.onVideoJSWaiting.bind(this));

    const hlsConfig = tech.options_.hlsConfig || {};
    const { ERROR, LEVEL_LOADED, MANIFEST_PARSED } = Hls.Events;

    this.hls = new Hls(hlsConfig);
    this.hls.on(ERROR, this.onHlsError.bind(this));
    this.hls.on(LEVEL_LOADED, this.onHlsLevelLoaded.bind(this));
    this.hls.on(MANIFEST_PARSED, this.onHlsManifestParsed.bind(this));
    this.hls.attachMedia(this.video);

    this.duration = 0;
    this.errors = {};
    this.HlsErrors = Hls.ErrorTypes;
  }

  onVideoJSError(event) {
    const mediaError = event.currentTarget.errors;
    const {
      MEDIA_ERR_ABORTED,
      MEDIA_ERR_DECODE,
      MEDIA_ERR_NETWORK,
      MEDIA_ERR_SRC_NOT_SUPPORTED,
    } = mediaError;

    switch (mediaError.code) {
      case MEDIA_ERR_ABORTED:
        console.error(`You aborted the video playback (Code ${MEDIA_ERR_ABORTED})`);
        break;
      case MEDIA_ERR_DECODE:
        console.error(`VideoJS playback was aborted due to a corruption problem or because the video used features your browser did not support (Code ${MEDIA_ERR_DECODE})`);
        break;
      case MEDIA_ERR_NETWORK:
        console.error(`A network error caused the video download to fail part-way (Code ${MEDIA_ERR_NETWORK})`);
        break;
      case MEDIA_ERR_SRC_NOT_SUPPORTED:
        console.error(`The video could not be loaded, either because the server or network failed or because the format is not supported (Code ${MEDIA_ERR_SRC_NOT_SUPPORTED})`);
        break;
      default:
        console.error(`An unknown error occured (Code ${mediaError.code})`)
    }
  }

  onVideoJSWaiting(event) {
    this.hls.loadSource(this.source.src);
    this.video.removeEventListener(VIDEOJS_EVENTS.ON_WAITING, this.onVideoJSWaiting.bind(this));
  }

  onHlsError(event, error) {
    const errorPayload = {
      message: `hls.js error: ${error.type} - fatal: ${error.fatal} - ${error.details}`,
    };
    console.error(errorPayload.message);

    this.errors[error.type] = ~~this.errors[error.type] + 1;

    const { MEDIA_ERROR, NETWORK_ERROR } = this.HlsErrors;
    if (error.fatal) {
      switch (error.type) {
        case MEDIA_ERROR:
          this.handleMediaError();
          break;
        case NETWORK_ERROR:
          console.info('Bubbling network error up to VideoJS');
          errorPayload.code = 2;
          this.tech.error = () => errorPayload;
          this.tech.trigger(VIDEOJS_EVENTS.ON_ERROR);
          break;
        default:
          console.info('Bubbling error up to VideoJS');
          this.hls.destroy();
          this.tech.error = () => errorPayload;
          this.tech.trigger(VIDEOJS_EVENTS.ON_ERROR);
      }
    }
  }

  onHlsLevelLoaded(event, data) {
    if (data.details.live) {
      this.duration = Infinity;
    } else {
      this.duration = data.details.totalDuration;
    }
  }

  onHlsManifestParsed(event, data) {
    const trackList = [];
    const { levels } = data;

    if (levels.length > 0) {
      const autoLevel = {
        id: -1,
        label: 'auto',
        selected: this.hls.manualLevel === -1
      };
      trackList.push(autoLevel);
    }

    trackList.push(data.level.map((level, index) => ({
      id: index,
      selected: index === this.hls.manualLevel,
      label: HlsProvider.getLevelLabel(level)
    })));

    this.tech.trigger(VIDEOJS_EVENTS.ON_LOADED_QUALITY_DATA, {
      qualityData: {
        video: trackList,
        qualitySwitchCallback: this.switchQuality.bind(this),
      }
    });
  }

  switchQuality(qualityId) {
    this.hls.nextLevel = qualityId;
  }

  dispose() {
    this.video.removeEventListener(VIDEOJS_EVENTS.ON_WAITING, this.onVideoJSWaiting.bind(this));
    this.hls.destroy();
  }

  duration() {
    return this.duration || this.video.duration || 0;
  }

  static getLevelLabel(level) {
    if (level.height) {
      return `${level.height}p`;
    } else if (level.width) {
      return `${(Math.round(level.width) * 9) / 16}p`;
    } else if (level.bitrate) {
      return `${level.bitrate / 1000}kbps`;
    }

    return '0';
  }
}