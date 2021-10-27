const { evaluate } = require("mathjs")

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    message.reply(message.guild.translate(lang+"assets")).catch(() => false);
  },
  interaction: async function(interaction, lang){
    interaction.reply(interaction.guild.translate(lang+"assets")).catch(() => false);
  },
  config: { name: "vote", aliases: ["upvote"], category: "utility", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}