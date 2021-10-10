module.exports = {
  exe: async function(message, prefix, command, args, lang){
    message.reply({ content: message.guild.translate("chooseLanguage"), components: [message.guild.translate("#misc.languageSelectMenu")] })
  },
  config: { name: "language", aliases: ["lang"], category: "config", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
  path: null
}