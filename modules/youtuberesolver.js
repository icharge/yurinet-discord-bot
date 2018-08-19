const ytdl = require("ytdl-core");
var Promise = require("bluebird");
Promise.promisifyAll(ytdl);
class youtubeResolver {
  constructor(msg, youtubeid) {
    this.msg = msg;
    this.youtubeid = youtubeid;
  }
  /* filterOpus(formats) {
      formats.sort((a, b) => {
          return parseInt(b.itag) - parseInt(a.itag);
      });
      for (let i = 0; i < formats.length; i++) {
          if (formats[i].itag === "251") {
              return formats[i].url;
          }
          if (formats[i].itag === "250") {
              return formats[i].url;
          }
      }
      return null;
  } */

  /**
   * 
   * @param {Array} formats Format list
   */
  filterBestFormat(formats) {
    const selectedFormats = [];
    for (let i = 0; i < formats.length; i++) {
      if (formats[i].itag === "250" || formats[i].itag === "251") {
        selectedFormats.push(formats[i]);
      } else if (formats[i].itag === "141" || formats[i].itag === "140") {
        selectedFormats.push(formats[i]);
      } else if (formats[i].container === "mp4" && formats[i].audioEncoding || formats[i].container === "webm" && formats[i].audioEncoding && formats[i].audioBitrate >= 128) {
        selectedFormats.push(formats[i]);
      }
    }

    selectedFormats.sort((a, b) => {
      return parseInt(b.itag) - parseInt(a.itag);
    });

    return selectedFormats[0];
  }

  async resolve(msg, youtubeid) {
    // let info = await ytdl.getInfoAsync(`https://www.youtube.com/watch?v=${youtubeid}`);
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${youtubeid}`, { filter: 'audioonly' });
    if (info.live_playback === "1") {
      return Promise.reject({
        message: "Something went wrong while trying to resolve the livestream"
      });
    } else {
      info.loaderUrl = `https://www.youtube.com/watch?v=${info.video_id}`;

      const selectedFormat = this.filterBestFormat(info.formats);

      console.log('Playable format :', selectedFormat);

      let directUrl = selectedFormat.url;
      let isOpus = selectedFormat.audioEncoding === 'opus';
      /* if (directUrl) {
          isOpus = true;
      } else {
          directUrl = this.filterStreams(info.formats);
      } */
      return {
        id: info.video_id,
        title: info.title,
        // duration: this.convertDuration(info),
        type: "youtube",
        url: info.loaderUrl,
        streamUrl: directUrl,
        isOpus,
        isResolved: true,
        user: msg.author.tag,
        userid: msg.author.id,
      };
    }
  }
}
module.exports = new youtubeResolver();