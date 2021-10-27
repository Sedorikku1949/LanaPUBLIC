const { progressBar } = Client;

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    const user = args[0] ? message.guild.members.selectMember(args[0], { user: true }) : message.author
    if (!user || !(user instanceof require("discord.js").User)) return message.reply(message.guild.translate("NO_USER_FOUND"));
    const userData = database.db.get("guild/"+message.guild.id, `xp["${user.id}"]`) ?? { xp: 0, lvl: 0, id: user.id};
    const oldLevel = (userData.lvl-1) > 0 ? (userData.lvl-1) : 0
    let oldSection = ((5 / 6) * oldLevel * (2 * oldLevel * oldLevel + 27 * oldLevel + 91) + 100)
    if (oldSection < 0) oldSection = 0;
    message.reply({ embeds: [{
      color: message.guild.colors("mainColor"),
      author: { name: user.tag, icon_url: user.displayAvatarURL({ dynamic: true }) },
      fields: [
        { name: message.guild.translate(lang+"assets.USER_PROGRESS"), value: "```\n"+( (new progressBar({ maxValue: ((5 / 6) * (oldLevel + 1) * (2 * (oldLevel + 1) * (oldLevel + 1) + 27 * (oldLevel + 1) + 91) + 100) - oldSection, value: (userData.xp - oldSection) > 0 ? (userData.xp-oldSection) : userData.xp, length: 15 })).draw() )+"\n```" , inline: false},
        { name: message.guild.translate(lang+"assets.LVL"), value: String(userData.lvl), inline: true },
        { name: message.guild.translate(lang+"assets.XP_PTS"), value: String((userData.xp).shortNumber()), inline: true },
      ]
    }] })
  },
  config: { name: "profile", aliases: ["rank"], category: "info", system: { perms: ["SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}