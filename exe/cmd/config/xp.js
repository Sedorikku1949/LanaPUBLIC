module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(lang.assets.noArgs);
    const guildData = await database.db.get("guild/"+message.guild.id)
    switch(args[0]) {
      case "msg": {
        if (!await database.db.get("guild/"+message.guild.id, "['_config'].xp")) return message.reply(lang.assets.xpDisable);
        if (!args[1]) return message.reply(lang.assets.msg.noArgs);
        switch(args[1]) {
          case "add": {
            if (!args[2]) return message.reply(lang.assets.msg.noAddArgument);
            const content = getBalise(message.content.slice(prefix.length+command.length+args[0].length+args[1].length+3), ["chl", "m"]);
            if (!content || content.length <= 0) return message.reply(lang.assets.msg.noBaliseFound);
            if (!content.find(e => e.balise == "m")) return message.reply(lang.assets.msg.baliseNeeded);
            if ((await database.db.get("guild/"+message.guild.id))?.messages?.length >= 10) return message.reply(lang.assets.msg.cantAddMoreMSG);
            /**
             * { 
             *  type: "xp",
             *  channel: null || STRING,
             *  content: STRING,
             *  id: AUTHOR_ID + Date.now
             * }
             */
            if (!content.find(e => e.balise == "m")?.content || content.find(e => e.balise == "m")?.content.length <= 0) return message.reply(lang.assets.msg.invalidMSG);
            let channel = content.some(e => e.balise == "chl") ? (await message.guild.channels.selectChannel(content.find(e => e.balise == "chl")?.content))?.id || null : null;
            if (content.some(e => e.balise == "chl") && !channel) return message.reply(lang.assets.msg.invalidChannel);
            let obj = { type: "xp", channel: channel, content: String(content.find(e => e.balise == "m")?.content), id: message.author.id+""+Date.now()+'_xp', author: message.author.id }
            await database.db.push("guild/"+message.guild.id, obj, "messages")
            lang.assets.msg.AddResponse.embeds[0].fields[0].value = lang.assets.msg.AddResponse.embeds[0].fields[0].value.replace(/{channel}/, !channel ? "locale" : `<#${channel}>`);
            lang.assets.msg.AddResponse.embeds[0].fields[1].value = lang.assets.msg.AddResponse.embeds[0].fields[1].value.replace(/{id}/, obj.id );
            lang.assets.msg.AddResponse.embeds[0].fields[2].value = lang.assets.msg.AddResponse.embeds[0].fields[2].value.replace(/{msg}/, obj.content.slice(0,1990) );
            message.reply(lang.assets.msg.AddResponse);
            break;
          };
          case "remove": {
            if (!args[2]) return message.reply(lang.assets.msg.noRemoveArgument);
            const messageToDelete = (await database.db.get("guild/"+message.guild.id))?.messages?.find(e => e.id === args[2] || message.guild.channels.selectChannel(args[2])?.id == e.channel);
            if (!messageToDelete) return message.reply(lang.assets.msg.noRemoveMessageFound);
            lang.assets.msg.removeResponse.embeds[0].title = lang.misc.remove.confirmationRequest;
            lang.assets.msg.removeResponse.embeds[0].fields[0].value = lang.assets.msg.removeResponse.embeds[0].fields[0].value.replace(/{channel}/, !messageToDelete.channel ? "locale" : `<#${messageToDelete.channel}>`);
            lang.assets.msg.removeResponse.embeds[0].fields[1].value = lang.assets.msg.removeResponse.embeds[0].fields[1].value.replace(/{id}/, messageToDelete.id );
            lang.assets.msg.removeResponse.embeds[0].fields[2].value = lang.assets.msg.removeResponse.embeds[0].fields[2].value.replace(/{msg}/, messageToDelete.content.slice(0,1990) );
            const msg = await message.reply(lang.assets.msg.removeResponse);
            await Promise.all([emojis.check.id, emojis.close.id].map(e => msg.react(e).catch(() => false)))
            const collector = msg.createReactionCollector({ time: 30000, filter: (react, user) => user.id == message.author.id && [emojis.check.id, emojis.close.id].includes(react.emoji.id)});
            let res = false;
            collector.on("collect", (react) => {
              res = true;
              collector.stop()
            });
            collector.on("end", () => { if (!res) return msg.edit(lang.assets.msg.noResponse); else msg.edit(lang.assets.msg.cancel); msg.reactions.removeAll().catch(() => false) })
            break;
          };
          case "list": {
            const messages = (await database.db.get("guild/"+message.guild.id))?.messages;
            if (!messages || !Array.isArray(messages)) return message.reply(lang.assets.msg.noDataList);
            const data = (messages.filter(e => e.type == "xp").length > 0 ? [...messages] : [{ channel: null, content: database.language.fr.misc.defaultXpMessage, id: "DEFAULT", author: client.user.id }]);
            let embeds = await Promise.all(data.map(async(e, index) => ({
                embeds: [{
                  title: lang.misc.list.title.replace(/{index}/g, index + 1).replace(/{maxIndex}/g, data.length),
                  fields: [
                    { name: lang.misc.list.id, value: "```js\n"+e.id+"```" , inline: true },
                    { name: lang.misc.list.channel, value: "**"+(e.channel ? `<#${e.channel}>` : "local" )+"**" , inline: true },
                    { name: lang.misc.list.author, value: "```\n"+((await message.guild.members.selectMember(e.author, { user: true, fetch: true, bot: true })?.tag) || "ERROR")+"```", inline: true },
                    { name: lang.misc.list.message, value: "```\n"+(e.content.replace(/```/g, "`\u200b``").slice(0,1990))+"```"},
                  ],
                  color: lang.misc.list.color
                }]
              }))
            );
            if (embeds.length < 2) { /* no collector */ message.channel.send(embeds[0]) }
            else {
              let  [msg, x] = [await message.channel.send(embeds[0]), 0];
              await Promise.all([emojis.undo.id, emojis.redo.id, emojis.cancel.id].map(e => msg.react(e)));
              const collector = msg.createReactionCollector({ time: 60_000, filter: (react, user) => user.id == message.author.id && [emojis.undo.id, emojis.redo.id, emojis.cancel.id].includes(react.emoji.id) });
              collector.on("collect", async(react) => {
                switch(react.emoji.id){
                  case emojis.undo.id: { x = decrease(x, embeds); await msg.edit(embeds[x]); react.users.remove(message.author.id).catch(() => 0); break };
                  case emojis.redo.id: { x = decrease(x, embeds); await msg.edit(embeds[x]); react.users.remove(message.author.id).catch(() => 0); break };
                  case emojis.cancel.id: { collector.stop(); break };
                }
              })
              collector.on("end", () => { msg.reactions?.removeAll().catch(() => false)})
            }
            break;
          };
          case "badges": {
            break;
          };
          default: message.reply(lang.assets.msg.noArgs)
        }
        break;
      };
      case "add": {
        if (!await database.db.get("guild/"+message.guild.id, "['_config'].xp")) return message.reply(lang.assets.xpDisable);
        break;
      };
      case "remove": {
        if (!await database.db.get("guild/"+message.guild.id, "['_config'].xp")) return message.reply(lang.assets.xpDisable);
        break;
      };
      case "on": {
        await database.db.set("guild/"+message.guild.id, guildData["_config"].xp ? false : true, '["_config"].xp');
        message.reply(guildData["_config"].xp ? lang.assets.on.disable : lang.assets.on.active).catch(() => false);
        break;
      };
      case "test": {
        if (!await database.db.get("guild/"+message.guild.id, "['_config'].xp")) return message.reply(lang.assets.xpDisable);
        await message.react("✅").catch(() => false);
        require("../../listeners/messageCreate/exe.js")(message, true);
        deleteCache(require.resolve("../../listeners/messageCreate/exe.js"));
        break;
      };
      case "nochannel": {
        if (!await database.db.get("guild/"+message.guild.id, "['_config'].xp")) return message.reply(lang.assets.xpDisable);
        message.reply(lang.assets.notAvailableOption);
        break;
      };
      case "norole": {
        if (!await database.db.get("guild/"+message.guild.id, "['_config'].xp")) return message.reply(lang.assets.xpDisable);
        message.reply(lang.assets.notAvailableOption);
        break;
      };
      case "nouser": {
        if (!await database.db.get("guild/"+message.guild.id, "['_config'].xp")) return message.reply(lang.assets.xpDisable);
        message.reply(lang.assets.notAvailableOption);
        break;
      };
      default: message.reply(lang.assets.invalidArgs);
    }
  },
  config: { name: "xp", aliases: [], category: "config", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
  path: null
}