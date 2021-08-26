module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(lang.assets.noArgs).catch(()=>false);
    switch(args[0]) {
      case "add": {
        if (!args[2]) return message.reply(lang.assets.noArgsAdd);
        const user = await message.guild.members.selectMember(args[1], { fetch: true, user: true, bot: true });
        if (!user || user?.id == message.author.id) return message.reply(lang.assets.invalidUser);
        if ((await database.db.get("blacklist")).some(e => e.id == user.id)) return message.reply(lang.assets.alreadyAdd);
        await database.db.push("blacklist", { id: user.id, reason: message.content.slice(prefix.length+command.length+args[0].length+args[1].length+3) } );
        lang.assets.add.embeds[0].description = lang.assets.add.embeds[0].description.replace(/{user}/g, user.tag);
        message.reply(lang.assets.add);
        break;
      };
      case "remove": {
        if (!args[1]) return message.reply(lang.assets.noArgsAdd);
        const user = await message.guild.members.selectMember(args[1], { fetch: true, user: true, bot: true });
        if (!user || user?.id == message.author.id) return message.reply(lang.assets.invalidUser);
        if (!(await database.db.get("blacklist")).some(e => e.id == user.id)) return message.reply(lang.assets.notInBlacklist);
        const index = (await database.db.get("blacklist")).findIndex(e => e.id == user.id);
        if (index < 0) return message.reply(lang.assets.indexFail);
        await database.db.remove("blacklist", null, index);
        lang.assets.remove.embeds[0].description = lang.assets.remove.embeds[0].description.replace(/{user}/g, user.tag);
        message.reply(lang.assets.remove);
        break;
      };
      case "list": {
        let blacklist = await database.db.get("blacklist");
        if (blacklist.length > 10){
          // splitArray && collector
          blacklist = [...blacklist.map(bl => {
            const user = message.guild.members.selectMember(bl.id, { fetch: true, user: true, bot: true });
            return ({ name: ((user.bot ? emojis.bot.msg+" `":"** ** ** ** ** ** ** **`")+((user?.tag).replace(/\`/g, "") || bl.id)+"`"), value: "```\n"+(bl.reason ?? "ERROR")+"```", inline: true })
          })];
          blacklist = blacklist.splitArray(10).map((bl, index) => ({
            embeds: [{
                author: { name: `${index+1}/${blacklist.splitArray(10).length}`},
                title: "Blacklist :",
                fields: bl,
                color: "#FEE75C"
              }]
          }) );
          
          let [x, msg] = [0, await message.reply(blacklist[0])]
          await Promise.all( [emojis.undo.id, emojis.redo.id, emojis.cancel.id].map(e => msg.react(e).catch(() => false)) );
          const collector = msg.createReactionCollector({ filter: (reaction, user) => user.id == message.author.id && [emojis.undo.id, emojis.redo.id, emojis.cancel.id].includes(reaction.emoji.id), time: 60000 });
          collector.on("collect", async(react) => { switch(react.emoji.id) { case emojis.undo.id: { x = decrease(x, blacklist); await msg.edit(blacklist[x]); react.users.remove(message.author.id).catch(() => 0); break; }; case emojis.redo.id: { x = increase(x, blacklist); await msg.edit(blacklist[x]); react.users.remove(message.author.id).catch(() => 0); break; }; case emojis.cancel.id:{ collector.stop(); break; } }; })
          collector.on("end", () => msg.reactions.removeAll().catch(() => false));
        } else {
          message.reply({ embeds: [{
            color: "#FEE75C",
              title: "Blacklist :",
              fields: blacklist.length > 0 ? [...blacklist.map(bl => {
                const user = message.guild.members.selectMember(bl.id, { fetch: true, user: true, bot: true });
                return ({ name: ((user.bot ? emojis.bot.msg+" `":"** ** ** ** ** ** ** **`")+((user?.tag).replace(/\`/g, "") || bl.id)+"`"), value: "```\n"+(bl.reason ?? "ERROR")+"```" })
              })] : [{ name: "Personne n'est dans la blacklist !", value: "** \u200b**"}]
            }]
          })
        }
        break;
      };
      case "clear": {
        const msg = await message.channel.send(lang.assets.clearMessageAttempt).catch(()=>false);
        await database.db.set("blacklist", []);
        msg.edit(lang.assets.clearMessageConfirmation).catch(()=>false)
        break;
      };
      case "see": {
        if (!args[1]) return message.reply(lang.assets.noSeeArgs)
        let blacklist = await database.db.get("blacklist");
        const user = await message.guild.members.selectMember(args[1], { fetch: true, user: true, bot: true });
        if (!user) return message.reply(lang.assets.invalidUser);
        const bl = blacklist.find(e => e.id == user.id);
        if (!bl) return message.reply(lang.assets.notInBlacklist);
        lang.assets.seeResponse.embeds[0].title = lang.assets.seeResponse.embeds[0].title.replace(/{user}/g, user.tag);
        lang.assets.seeResponse.embeds[0].description = lang.assets.seeResponse.embeds[0].description.replace(/{desc}/g, bl.reason.slice(0,1985));
        lang.assets.seeResponse.embeds[0].footer.text = lang.assets.seeResponse.embeds[0].footer.text.replace(/{id}/g, user.id);
        message.reply(lang.assets.seeResponse);
        break;
      };
      default: return message.reply(lang.assets.invalidArgs)
    }
  },
  config: { name: "blacklist", aliases: ["bl"], category: "dev", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: true } },
  path: null
}