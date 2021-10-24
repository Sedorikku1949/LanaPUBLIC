const { evaluate } = require("mathjs")

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(message.guild.translate(lang+"assets.noArgs"));
    let res = false; try { res = evaluate(message.content.slice(prefix.length+command.length+1)) } catch(err) { res = "ERROR"};
    message.reply(message.guild.translate(lang+"assets.res", res));
  },
  config: { name: "calculator", aliases: ["calculate", "calc", "calcul"], category: "utility", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}