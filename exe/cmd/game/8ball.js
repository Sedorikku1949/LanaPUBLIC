module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(message.guild.translate(lang+"assets.noArgs"));
    const data = message.guild.translate(lang+"assets.properties")
    message.reply(message.guild.translate(lang+"assets.res", data[Math.floor(Math.random()*data.length)]))
  },
  config: { name: "8ball", aliases: [], category: "game", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}