# yurinet-discord-bot
A Discord bot for **Yurinet Server** that are still in development.

## Requirements:
* Node >= 8.0.0
* NPM
* Git
* ffmpeg
* Buildtools and Python 2.7

## Installation
install requirements

Windows: Run ``npm install --global --production windows-build-tools`` in an admin command prompt or PowerShell and then install python 2.7 and ffmpeg.

Linux: ``sudo apt install build-essential libtool libtool-bin autoconf automake ffmpeg python2.7``

Then ```npm install ```

## Config.json
```json
{
  "token": "BotToken",
  "commandPrefix": "!",
  "chatlogidroom": "roomid",
  "socketioserver": "socketioserver",
  "youtubeAPI": "youtubeAPIKEY"
}
```
