function getCategoryBar(list){ return list.map((e) => { return list.map(l => { if (l == e) { return `[ ${l} ]`; } else { return l; } }).join(" / "); }); };
function findAllCategories(list){ let res = []; list.forEach(cmd => { if (!res.includes(cmd.config.category)) { res.push(cmd.config.category) } else return; }); return res; }

async function sendSpecificCommandHelp(msg, cmd, message, lang){
    const l = clone(await database.db.get("user/"+message.author.id) ? (database.language[await database.db.get("user/"+message.author.id).lang] || database.language.fr) : database.language.fr );
    const embed = JSON.parse(JSON.stringify(lang.assets.specificCommand));
    embed.embeds[0].title = embed.embeds[0].title.replace(/{name}/, cmd.config.name)
    embed.embeds[0].thumbnail.url = client.user.displayAvatarURL({ size: 2048, format: "png" });
    embed.embeds[0].fields[0].value = embed.embeds[0].fields[0].value.replace(/{category}/, (l.misc.category[cmd.config.category] || cmd.config.category) )
    embed.embeds[0].fields[1].value = embed.embeds[0].fields[1].value.replace(/{aliase}/, (cmd.config.aliases.length > 0 ? cmd.config.aliases.join(" / ") : lang.misc.noAliase) )
    embed.embeds[0].fields[2].value = embed.embeds[0].fields[2].value.replace(/{desc}/, (Object.entries(l.commands).find(e => e[0] == cmd.config.name) ? Object.entries(l.commands).find(e => e[0] == cmd.config.name)[1].desc : undefined || "...") )
    embed.embeds[0].fields[3].value = embed.embeds[0].fields[3].value.replace(/{use}/, (Object.entries(l.commands).find(e => e[0] == cmd.config.name) ? Object.entries(l.commands).find(e => e[0] == cmd.config.name)[1].use : undefined || "...") ).replace(/{prefix}/g, (await database.db.get("guild/"+message.guild.id) ? (await database.db.get("guild/"+message.guild.id).prefix || client.prefix) : client.prefix))
    if (!msg) message.reply(embed)
    else msg.edit(embed)
}

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) { // page général
      const categoryList = findAllCategories(database.commands); const categoryPagePosition = getCategoryBar(categoryList);
      let embedList = [];
      categoryList.forEach(ctg => {
        const index = categoryList.findIndex(e => e == ctg);
        const i = embedList.length;
        embedList[i] = JSON.parse(JSON.stringify(lang.misc.commandsList)); embedList[i].embeds[0].author.icon_url = client.user.displayAvatarURL({size:2048, format: "png"})
        embedList[i].embeds[0].thumbnail.url = client.user.displayAvatarURL({ size: 2048, format: "png" }) ; embedList[i].embeds[0].description = embedList[i].embeds[0].description.replace(/{position}/, categoryPagePosition[index]).replace(/{commands}/, (database.commands.filter(e => e.config.category == ctg).map(e => e.config.name).join("\n➯ ")));
      });

      let [x, msg] = [0, await message.reply(embedList[0])]
      await Promise.all([emojis.search.id, emojis.undo.id, emojis.redo.id, emojis.cancel.id].map((e) => msg.react(e).catch(()=>false)))
      const collector = msg.createReactionCollector({ filter: (react, user) => [emojis.search.id, emojis.undo.id, emojis.redo.id, emojis.cancel.id].includes(react.emoji.id) && user.id == message.author.id, time: 60000 })
      collector.on("collect", async function(react){
        switch(react.emoji.id){
          case emojis.search.id:{ /* search */ 
            await msg.reactions.removeAll(); await msg.edit(lang.assets.searchCommand)
            const c = message.channel.createMessageCollector({ filter: (m) => m.author.id == message.author.id, time: 60000 })
            c.on("collect", async function(m){
              const cmd = database.commands.find((cmd) => cmd.config.name == m.content.toLowerCase() || (cmd.config.aliases.length > 0 && cmd.config.aliases.includes(m.content.toLowerCase())));
              if (!cmd) {
                const embed = lang.assets.noCommandsFound; embed.embeds[0].description = embed.embeds[0].description.replace(/{search}/, emojis.search.msg);
                msg.edit(embed);
              }
              else sendSpecificCommandHelp(msg, cmd, message, lang);
              m.delete().catch(() => {}) && c.stop();
            })
            c.on("end", function(){});
            break;
          };
          case emojis.undo.id:{/* undo */ x = decrease(x, embedList); msg.edit(embedList[x]).catch(() => false); react.users.remove(message.author.id).catch(() => 0); break;};
          case emojis.redo.id:{ /* redo */ x = increase(x, embedList); msg.edit(embedList[x]).catch(() => false); react.users.remove(message.author.id).catch(() => 0); break; };
          case emojis.cancel.id:{ /* cancel */ collector.stop(); break; }
        }
      });

      collector.on("end", () => msg.reactions.removeAll().catch(() => false))

    } else {
      const cmd = database.commands.find((cmd) => cmd.config.name == message.content.slice(prefix.length+command.length+1).toLowerCase() || (cmd.config.aliases.length > 0 && cmd.config.aliases.includes(message.content.slice(prefix.length+command.length+1).toLowerCase())));
      if (!cmd) {
        const embed = lang.assets.noCommandsFound; embed.embeds[0].description = embed.embeds[0].description.replace(/{search}/, emojis.search.msg);
        message.channel.send(embed);
      }
      else sendSpecificCommandHelp(null, cmd, message, lang)
    }
  },
  interaction: async function(interaction, lang){
    const embed = JSON.parse(JSON.stringify(lang.assets.interaction));
    const categoryList = findAllCategories(database.commands);
    embed.embeds[0].thumbnail.url = client.user.displayAvatarURL({size: 2048, format: "png"});
    categoryList.forEach((ctg) => {
       const modele = JSON.parse(JSON.stringify(lang.misc.interactionField))
       modele.name = modele.name.replace(/{category}/, ctg);
       modele.value = modele.value.replace(/{list}/,(database.commands.filter(e => e.config.category == ctg).map(e => e.config.name).join("\n")))
       embed.embeds[0].fields.push(modele);
    });
    interaction.reply(embed)
  },
  config: { name: "help", aliases: ["h"], category: "info", system: { perms: ["SEND_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}