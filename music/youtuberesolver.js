const ytdl = require('ytdl-core');
var Promise = require("bluebird");
Promise.promisifyAll(ytdl);
class youtubeResolver {
  constructor(msg, youtubeid) {
    this.msg = msg
    this.youtubeid = youtubeid;
  }
  filterOpus(formats) {
    formats.sort((a, b) => {
      return parseInt(b.itag) - parseInt(a.itag);
    });
    for (let i = 0; i < formats.length; i++) {
      if (formats[i].itag === '251') {
        return formats[i].url;
      }
      if (formats[i].itag === '250') {
        return formats[i].url;
      }
    }
    return null;
  }

  filterStreams(formats) {
    for (let i = 0; i < formats.length; i++) {
      if (formats[i].itag === '250' || formats[i].itag === '251') {
        return formats[i].url;
      }
      if (formats[i].itag === '141' || formats[i].itag === '140') {
        return formats[i].url;
      }
      if (formats[i].container === 'mp4' && formats[i].audioEncoding || formats[i].container === 'webm' && formats[i].audioEncoding && formats[i].audioBitrate >= 128) {
        return formats[i].url;
      }
    }
    return null;
  }
  async resolve(msg, youtubeid) {
    let info = await ytdl.getInfoAsync(`https://www.youtube.com/watch?v=${youtubeid}`);
    if (info.live_playback === '1') {
      return Promise.reject({
        message: 'Something went wrong while trying to resolve the livestream'
      });
    } else {
      info.loaderUrl = `https://www.youtube.com/watch?v=${info.video_id}`;
      let directUrl = this.filterOpus(info.formats);
      let isOpus = false;
      if (directUrl) {
        isOpus = true;
      } else {
        directUrl = this.filterStreams(info.formats);
      }
      return {
        id: info.video_id,
        title: info.title,
        // duration: this.convertDuration(info),
        type: 'youtube',
        url: info.loaderUrl,
        streamUrl: directUrl,
        isOpus: isOpus,
        isResolved: true,
        local: false,
        user: msg.author.username + '#' + msg.author.discriminator,
        userid: msg.author.id,
      };
    }

  }
}
module.exports = new youtubeResolver();