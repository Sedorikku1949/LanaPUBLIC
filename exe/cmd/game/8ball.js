module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(lang.assets.noArgs);
    message.reply((JSON.parse(JSON.stringify(lang.assets.response))).replace(/{response}/g, lang.miscs[Math.floor(Math.random()*lang.miscs.length)]))
  },
  config: { name: "8ball", aliases: [], category: "game", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}