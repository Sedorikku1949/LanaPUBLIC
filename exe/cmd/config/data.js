
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
        let db = config.bdd.guilds; db.id = message.guild.id; database.db.set("guild/"+message.guild.id, db);
        let embed = JSON.parse(JSON.stringify(lang.assets.dataReset)); embed.embeds[0].footer.text = embed.embeds[0].footer.text.replace(/{prefix}/g, client.prefix); message.channel.send(embed);
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
    const c = message.channel.createMessageCollector({ filter: (m) => m.author.id == message.author.id && ["see", "reset", "save", "repair", "cancel"].includes(m.content.toLowerCase().trim()), time: 60000 });
    c.on("collect", async function(m){
      if (m.content == "repair") msg.delete().catch(() => false)
      switch(m.content.toLowerCase().trim()){
        case "see": {
          let str = await database.db.get("guild/"+message.guild.id);
          str = require("util").inspect(str);
          msg.delete().catch(() => false);
          m.delete().catch(() => false)
          let code = JSON.parse(JSON.stringify(lang.assets.seeData))
          const bffr = Buffer.from(JSON.stringify(((await database.db.getPrimitive("guild/"+message.guild.id)) ?? {}), null, 2));
          code.files = [{ name: "see.json", attachment: bffr}];
          message.reply(code).catch(() => false);
          c.stop();
          break;
        };
        case "reset": {
          if (message.author.id !== message.guild.ownerId) return message.channel.send(lang.assets.ownerOnly) && msg.delete().catch(() => false) && m.delete().catch(() => false);
          m.delete().catch(() => false)
          reset(message, prefix, command, args, msg, lang);
          c.stop()
          break;
        };
        case "save": {
          if (message.author.id !== message.guild.ownerId) return message.reply(lang.assets.ownerOnlySave)
          const bffr = Buffer.from(JSON.stringify(((await database.db.getPrimitive("guild/"+message.guild.id)) ?? {}), null, 2));
          lang.assets.save.files = [{ name: "save.json", attachment: bffr}];
          m.react(emojis.check.id).catch(() => false);
          message.author.send(lang.assets.save).catch(() => message.reply(lang.assets.save).catch(() => false));
          c.stop()
          break;
        };
        case "repair": {
          // analyse
          m.delete().catch(() => false)
          const ms = await message.channel.send(lang.assets.analyseInProgress.replace(/{load}/, emojis.reload.msg));
          const data = await database.db.get("guild/"+message.guild.id);
          let error = 0;
          if (!objectHaveSameKeys(data, config.bdd.guilds)) error++;
          if (!Array.isArray(data.messages)) error++;
          if (data.id !== message.guild.id) error++;
          if (typeof data.prefix !== "string") error++;
          if (typeof data.xp !== "object" || Array.isArray(data.xp)) error++;
          if (typeof data.invite !== "object" || Array.isArray(data.invite)) error++;
          if (typeof data.ticket !== "object" || Array.isArray(data.ticket)) error++;
          if (typeof data.moderation !== "object" || Array.isArray(data.moderation)) error++;
          if (typeof data["_config"] !== "object" || Array.isArray(data["_config"])) error++;
          if (typeof data.money !== "object" || Array.isArray(data.money)) error++;

          await ms.delete()
          if (error < 1) return message.reply(lang.assets.repairAnalyseNegative)
          lang.assets.repairAnalysePositive.embeds[0].description = lang.assets.repairAnalysePositive.embeds[0].description.replace(/{nb}/, error).replace(/{a}/g, error > 1 ? lang.misc.plurial : lang.misc.singular);
          lang.assets.repairAnalysePositive.content = message.author.toString();
          const msg = await message.reply(lang.assets.repairAnalysePositive);
          await Promise.all([emojis.check.id, emojis.close.id].map(e => msg.react(e)));
          const collector = msg.createReactionCollector({ time: 60000, filter: (react, user) => [emojis.check.id, emojis.close.id].includes(react.emoji.id) && user.id == message.author.id});
          collector.on("collect", async(react) => {
            switch(react.emoji.id) {
              case emojis.check.id: {
                const newData = repairObject(data, config.bdd.guilds);
                await database.db.set("guild/"+message.guild.id, newData);
                msg.edit(lang.assets.repairRes)
                collector.stop()
                break;
              };
              case emojis.close.id: {
                await msg.edit(lang.assets.cancel);
                collector.stop();
                break;
              }
            }
          })
          collector.on("end", () => msg.reactions.removeAll().catch(() => false));
          c.stop();
          break;
        }
        case "cancel": {
          m.delete().catch(() => false);
          message.channel.send(lang.assets.cancel).catch(() => false);
          c.stop();
          break;
        }
      }
    });
    c.on("end", function(){ msg.delete().catch(() => false) })
  },
  config: { name: "data", aliases: [], category: "config", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS"], delInvoke: false, inProgress: true, staffCommand: true, devCommand: false } },
  path: null
}