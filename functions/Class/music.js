const djs = require("discord.js");
const { getInfo } = require('ytdl-core');
const { FFmpeg } = require('prism-media')
const { createAudioResource, createAudioPlayer, StreamType, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, getNextResource } = require("@discordjs/voice");

async function checkURL(str) { try { return await getInfo(str) } catch(err) { return false; } }

async function getVideoInfo(url){
  try {
    return await getInfo(url).then((v) => v?.videoDetails)
  } catch(err) { return null; };
}

async function s(id, cmd = false){
  console.log(cmd)
  //console.log(id)
  if (!database.musicManager.get(id)) return console.log("nop");
  if(database.musicManager.get(id).nowExecuting) return;
  database.musicManager.get(id).nowExecuting = true;
  if (database.musicManager.get(id).queue.length < 2 && !cmd && !database.musicManager.get(id).loop) {
    database.musicManager.get(id).queue = []
    database.musicManager.get(id).response.send({ embeds: [{ color: "#5865F2", description: ">>> **Je n'ai trouvé aucune autre musique dans la queue.**\nRelance une musique avec la commande \"play\" !" }] }).catch(() => false);
    console.log("skip");
    database.musicManager.get(id).player.stop();
    database.musicManager.get(id).nowExecuting = false;
  } else if (database.musicManager.get(id).queue.length < 2 && !database.musicManager.get(id).loop) {
    database.musicManager.get(id).queue = [];
    console.log("skip");
    database.musicManager.get(id).player.stop();
    database.musicManager.get(id).nowExecuting = false;
  }
  else if (database.musicManager.get(id).loop) {
    console.log("loop")
    database.musicManager.get(id).player.stop();
    database.musicManager.get(id).nowExecuting = false;
    database.musicManager.get(id).startPlaying(database.musicManager.get(id).queue[0].url);
  }
  else {
    database.musicManager.get(id).queue.shift()
    database.musicManager.get(id).player.stop();
    database.musicManager.get(id).nowExecuting = false;
    database.musicManager.get(id).startPlaying(database.musicManager.get(id).queue[0].url);
  }
}

class guildMusic {
  constructor(channel, message){
    this.queue = [];
    this.nowPlaying = {};
    this.volume = 0.5;
    this.loop = false;
    this.channel = channel;
    this.id = channel.guild.id
    this.guild = channel.guild;
    this.ressource = null;
    this.connection = null;
    this.player = null;
    this.response = message.channel;
    this.nowExecuting = false;
    this.nowPlaying = false;
  }

  async join(){
    this.nowExecuting = true;
    this.connection = joinVoiceChannel({
      channelId: this.channel.id,
      guildId: this.guild.id,
      adapterCreator: this.guild.voiceAdapterCreator,
    });
    this.nowExecuting = false;
  }

  async getVideoInfo(url){
    try {
      return await getInfo(url).then((v) => v?.videoDetails)
    } catch(err) { return null; };
  }

  async createPlayer(){
    this.nowExecuting = true;
    this.player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause, } })
    const skip = this.skip;
    const id = this.id;

    // Error event
    this.player.on("error", async function(){
      skip(id);
    });

    // Idle event
    this.player.on(AudioPlayerStatus.Idle, async function(){
      database.musicManager.get(id).nowPlaying = false;
      skip(id);
    });

    this.nowExecuting = false;
  }

  async startPlaying(url){
    if(this.nowExecuting) return;
    this.nowExecuting = true;
    if (typeof url !== "string" || !(await checkURL(url))) {
      this.response.send({ embeds: [{ color: "#5865F2", description: "> **Je n'ai trouvé aucune musique dans la queue.**" }] }).catch(() => false);
      this.nowExecuting = false;
    }
    else {
      if (!( await checkURL(url))) {
        this.nowExecuting = false;
        return null;
      }
      else {
        if (!this.player) { await this.createPlayer() }

        const audioURL = await getInfo(url).then(({ formats }) => (formats.filter((f) => f.audioBitrate && f.audioBitrate > 0).sort((a,b) => Number(b.audioBitrate) - Number(a.audioBitrate)).find((format) => !format.bitrate) || formats[0]));
        const args = ['-reconnect', '1', '-reconnect_streamed', '1', '-reconnect_delay_max', '5', '-i', audioURL.url, '-analyzeduration', '0', '-loglevel', '0', '-ar', '48000', '-ac', '2', '-acodec', 'libopus', '-f', 'opus'];

        //this.player = this.player || this.createPlayer();
        this.ressource = createAudioResource(new FFmpeg({ args, shell: false }), { inputType: StreamType.OggOpus, inlineVolume: true });

        this.player.play(this.ressource);
        this.connection.subscribe(this.player);

        database.musicManager.get(this.id).nowPlaying = true
        if (!this.ressource) {
          this.connection.destroy();
          this.nowExecuting = false;
        }
        else {
          this.ressource.volume.setVolume(0.5);
          if (!this.connection) {
            this.nowExecuting = false;
            return null;
          }
          else {
            this.connection?.subscribe(this.player);
            this.nowExecuting = false;
          }
        };
      }
    }
  };

  async skip(id, cmd){ if (!id) return; return s(id, cmd) };

  async pause(){
    if(this.nowExecuting) return;
    this.nowExecuting = true;
    this.player.pause()
    this.nowExecuting = false;
  };
  async unPause() {
    if(this.nowExecuting) return;
    this.nowExecuting = true;
    this.player.unpause()
    this.nowExecuting = false;
  };

  async delete(){
    if(this.nowExecuting) return;
    this.nowExecuting = true;
    database.musicManager.delete(this.guild.id)
    this.nowExecuting = false;
  };

  async changeVolume(percent){
    if(this.nowExecuting) return;
    else {
      this.nowExecuting = true;
      if (isNaN(percent) || percent < 1 || percent > 1000 || Math.floor(percent) - percent !== 0) {
        this.nowExecuting = false
        return null
      }
      else {
        await this.ressource.volume.setVolume(Math.floor(percent)/100);
        this.volume = Math.floor(percent)/100
        this.nowExecuting = false;
        return true;
      }
    }
  }
}

class musicManager extends Map {
  constructor() {
    super()
  }

  create = function(channel, message){
    if (!(channel instanceof djs.VoiceChannel)) return null;
    if (this.get(channel.guild.id)) return false;
    this.set(channel.guild.id, new guildMusic(channel, message));
    return true;
  };

  remove = function(guild){
    return this.delete(guild?.id);
  };
}

module.exports = { musicManager, guildMusic, checkURL, getVideoInfo }