class queue {
  constructor(msg, song) {
    this.list = [];
  };
  add(msg, song) {
    let guildid = msg.guild.id;
    if (!this.list[guildid]) {
      this.list[guildid] = {
        song: []
      };
    };
    this.list[guildid]['song'].push(song);
  };
  removefrist(msg) {
    let guildid = msg.guild.id;
    this.list[guildid]['song'].splice(0, 1);
  };
  clearlist(msg) {
    let guildid = msg.guild.id;
    this.list[guildid]['song'] = [];
  };
  showlist(msg) {
    let guildid = msg.guild.id;
    return this.list[guildid]['song'];
  };
};
module.exports = new queue();