module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(lang.assets.noArgs);
    const percent = args[0];
    if (isNaN(percent) || percent < 1 || percent > 1000 || Math.floor(percent) - percent !== 0) return message.reply(lang.assets.invalidVol);
    if (!database.musicManager.get(message.guild.id)?.nowPlaying) return message.reply(lang.assets.noMusic);
    if (!message.member.voice?.channel || message.guild.members.cache.get(client.user.id)?.voice?.channel?.id !== message.member.voice.channel?.id) return message.reply(lang.assets.nop);
    await database.musicManager.get(message.guild.id).changeVolume(percent);
    message.reply(lang.assets.success.replace(/{percent}/g, args[0]));
  },
  config: { name: "volume", aliases: [], category: "music", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}