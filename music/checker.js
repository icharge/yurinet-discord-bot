let regex = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)(?:&.*|)/;
class checker {
  constructor(msg, example) {
    this.example = example;
    this.msg = msg;
  };
  check(example) {
    if (regex.test(example)) {
      return regex.exec(example)[1].toString();
    } else {
      return null;
    };
  };
};
module.exports = new checker();