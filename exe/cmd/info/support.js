module.exports = {
  exe: function(message, prefix, command, args, lang){ message.reply(message.guild.translate(lang+"assets")); },
  interaction: async function(interaction, lang){ interaction.reply(interaction.guild.translate(lang+"assets")); },
  config: { name: "support", aliases: [], category: "info", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}