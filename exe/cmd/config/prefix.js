module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!(await database.db.get("guild/"+message.guild.id))) return message.reply(message.guild.translate(lang+"assets.databaseError"));
    if (!args[0]) return message.reply(message.guild.translate(lang+"assets.noArgs"))
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply(message.guild.translate(lang+"assets.notAdmin"));
    if (args[0].match(/[0-9]/g, "")) return message.reply(message.guild.translate(lang+"assets.invalidArgs"))
    const msg = await message.reply(message.guild.translate(lang+"assets.question", args[0].replace(/[0-9]/g, "")))
    await Promise.all([emojis.check.id, emojis.close.id].map((e) => msg.react(e)))
    const collector = msg.createReactionCollector({ time: 30000, filter: (react, user) => [emojis.check.id, emojis.close.id].includes(react.emoji.id) && user.id == message.author.id });
    collector.on("collect", async(react) => {
      switch(react.emoji.id){
        case emojis.check.id: {
          /* modifier le préfix */
          await database.db.set("guild/"+message.guild.id, args[0].replace(/[0-9]/g, ""), 'prefix');
          msg.edit(message.guild.translate(lang+"assets.res", args[0].replace(/[0-9]/g, ""))).catch(() => false);
          collector.stop(); break;
        };
        case emojis.close.id: {
          /* annulation de l'action */ msg.edit(message.guild.translate(lang+"assets.cancel")).catch(() => false); collector.stop(); break;
        };
      }
    })
    collector.on("end", () => msg.reactions.removeAll().catch(() => false))
  },
  config: { name: "prefix", aliases: [], category: "config", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
  path: null
}