
async function reset(message, prefix, command, args, msg, lang){
  const me = await msg.channel.send(lang.assets.resetConfirmation)
  await Promise.all([emojis.check.id, emojis.close.id].map(e => me.react(e).catch(() => false)))
  const collector = me.createReactionCollector({ time: 30000, filter: (react, user) => [emojis.check.id, emojis.close.id].includes(react.emoji.id) && user.id == message.author.id });
  let a = false;
  collector.on("collect", function(react){
    a = true;
    me.delete().catch(() => false)
    switch(react.emoji.id){
      case emojis.check.id: {
        let db = config.bdd.guilds;
        db.id = message.guild.id;
        database.db.set("guild/"+message.guild.id, db);
        let embed = JSON.parse(JSON.stringify(lang.assets.dataReset));
        embed.embeds[0].footer.text = embed.embeds[0].footer.text.replace(/{prefix}/g, client.prefix);
        message.channel.send(embed);
        collector.stop();
        break;
      };
      case emojis.close.id: {
        message.channel.send(lang.assets.cancel).catch(() => false);
        collector.stop();
        break;
      };
    };
  });

  collector.on("end", function(){ me.reactions.removeAll().catch(() => false); if (!a) message.channel.send(lang.assets.timeout).catch(() => false); })
}

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply(lang.assets.notAdmin);
    const msg = await message.reply(lang.assets.actionType).catch(() => false);
    const collector = message.channel.createMessageCollector({ filter: (m) => m.author.id == message.author.id && ["see", "reset", "cancel"].includes(m.content.toLowerCase().trim()), time: 60000 });
    collector.on("collect", async function(m){
      switch(m.content.toLowerCase().trim()){
        case "see": {
          let str = await database.db.get("guild/"+message.guild.id);
          str = require("util").inspect(str);
          msg.delete().catch(() => false);
          m.delete().catch(() => false)
          let code = JSON.parse(JSON.stringify(lang.assets.seeData))
          code = code.replace(/{code}/, (str.slice(0,1950)).replace(/\`/g, "\u200b`"));
          message.reply({ content: code, ephemeral: true }).catch(() => false);
          collector.stop();
          break;
        };
        case "reset": {
          if (message.author.id !== message.guild.ownerId) return message.channel.send(lang.assets.ownerOnly) && msg.delete().catch(() => false) && m.delete().catch(() => false);
          m.delete().catch(() => false)
          reset(message, prefix, command, args, msg, lang);
          collector.stop()
          break;
        };
        case "cancel": {
          m.delete().catch(() => false);
          message.channel.send(lang.assets.cancel).catch(() => false);
          collector.stop();
          break;
        }
      }
    });
    collector.on("end", function(){ msg.delete().catch(() => false) })
  },
  config: { name: "data", aliases: [], category: "config", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
  path: null
}