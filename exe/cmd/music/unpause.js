module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!database.musicManager.get(message.guild.id)?.nowPlaying) return message.reply(lang.assets.noMusic);
    if (!message.member.voice?.channel || database.musicManager.get(message.guild.id).channel.id !== message.member.voice.channel?.id) return message.reply(lang.assets.nop);
    await database.musicManager.get(message.guild.id).unPause();
    message.reply(lang.assets.success);
  },
  config: { name: "unpause", aliases: [], category: "music", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}