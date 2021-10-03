module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!database.musicManager.get(message.guild.id)?.nowPlaying) return message.reply(lang.assets.noMusic);
    if (!message.member.voice?.channel || message.guild.members.cache.get(client.user.id)?.voice?.channel?.id !== message.member.voice.channel?.id) return message.reply(lang.assets.nop);
    if (database.musicManager.get(message.guild.id).loop){
      // disable
      database.musicManager.get(message.guild.id).loop = false;
      message.reply(lang.assets.off);
    } else {
      // enable
      database.musicManager.get(message.guild.id).loop = true
      message.reply(lang.assets.on);
    }
  },
  config: { name: "loop", aliases: [], category: "music", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}