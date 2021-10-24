module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(message.guild.translate(lang+"assets.noArgs"));
    const channel = message.guild.channels.selectChannel(args[0], { type: "GUILD_VOICE" }) ?? message.member.voice?.channel;
    if (!channel || !channel.id) return message.reply(message.guild.translate(lang+"assets.noChannel"));
    client.discordTogether.createTogetherCode(channel.id, 'chess').then((invite) => {
      message.reply({ embeds: [{ color: message.guild.colors("royalblue"), description: message.guild.translate(lang+"assets.res", invite.code)}] }).catch(() => false);
    })
  },
  interaction: async function(interaction, lang){
    const channel = interaction.member.voice?.channel;
    if (!channel || !channel.id) return interaction.reply(interaction.guild.translate(lang+"assets.noChannel"));
    client.discordTogether.createTogetherCode(channel.id, 'chess').then((invite) => {
      interaction.reply({ embeds: [{ color: interaction.guild.colors("royalblue"), description: interaction.guild.translate(lang+"assets.res", invite.code)}] }).catch(() => false);
    })
  },
  config: { name: "chess", aliases: ["echec"], category: "game", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}