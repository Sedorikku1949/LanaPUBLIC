module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(lang.assets.noArgs);
    const channel = message.guild.channels.selectChannel(args[0], { type: "GUILD_VOICE" });
    if (!channel || !channel.id) return message.reply(lang.assets.noChannel)
    const invite = await client.discordTogether.createTogetherCode(channel.id, 'youtube');
    const embed = JSON.parse(JSON.stringify(lang.assets.invite));
    embed.embeds[0].description = embed.embeds[0].description.replace(/{url}/, invite.code);
    message.reply(embed);
  },
  config: { name: "youtube", aliases: ["ytb"], category: "game", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}