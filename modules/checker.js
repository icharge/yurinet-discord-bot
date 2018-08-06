const regex = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)(?:&.*|)/;
class checker {
    constructor(url) {
        this.url = url;
    }
    check(url) {
        if (regex.test(url)) {
            return regex.exec(url)[1].toString();
        } else {
            return null;
        }
    }
}
module.exports = new checker();