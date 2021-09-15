const EventEmitter = require("events")
const djs = require("discord.js")

class musicEmitter extends EventEmitter {
  constructor() {
    super()
    this.on("startPlaying", function(){})
  }
}

class musicInfo {
  //
}

class guildMusic {
  constructor(guild){
    this.queue = [];
    this.nowPlaying = {};
    this.loop = false;
    this.channel = null;
    this.id = guild.id
    this.guild = guild;
  }
}

class musicManager extends Map {
  constructor() {
    super()
  }

  newVoiceChannel = function(channel){
    if (!(channel instanceof djs.VoiceChannel)) return null;
    if (this.get(channel.guild.id)) return false;
    this.set(channel.guild.id, new guildMusic(channel.guild));
    return true;
  };

  delete = function(guild){
    if (!(guild instanceof djs.Guild) || !this.get(guild?.id)) return null;
    this.delete(guild?.id);
    return true;
  }
}

module.exports = { musicManager, musicEmitter, guildMusic }