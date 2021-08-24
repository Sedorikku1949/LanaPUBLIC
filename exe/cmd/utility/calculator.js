const { evaluate } = require("mathjs")

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(lang.assets.noArgs);
    message.reply(lang.assets.response.replace(/{calc}/g, evaluate(message.content.slice(prefix.length+command.length+1))))
  },
  config: { name: "calculator", aliases: ["calculate", "calc", "calcul"], category: "utility", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}