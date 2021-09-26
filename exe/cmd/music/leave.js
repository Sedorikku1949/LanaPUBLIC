module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!message.member.voice?.channel || database.musicManager.get(message.guild.id).channel.id !== message.member.voice.channel?.id) return message.reply(lang.assets.nop);
    await database.musicManager.get(message.guild.id).player.stop();
    await database.musicManager.get(message.guild.id).connection.destroy();
    database.musicManager.remove(message.guild)
    message.reply(lang.assets.success);
  },
  config: { name: "leave", aliases: [], category: "music", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}