// 

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    message.reply({ embeds: [{
      color: "RED",
      image: { url: "https://media.discordapp.net/attachments/848805763434283049/874945386350014464/2Q.png" }
    }]});
  },
  config: { name: "advancement", aliases: ["adv"], category: "info", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}