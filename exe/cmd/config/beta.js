module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(lang.assets.noArgs);
    switch(args[0]) {
      case "join": {
        const betaGuilds = await database.db.get("system/beta");
        if (betaGuilds.guilds.includes(message.guild.id)) return message.reply(lang.assets.join.serverAlreadyInBeta)
        if (betaGuilds.guilds.some(e => client.guilds.cache.get(e).ownerId == message.author.id)) return message.reply(lang.assets.join.otherServerInBeta);
        if (betaGuilds.guilds.length >= betaGuilds.limit) return message.reply(lang.assets.join.serverLimitReach);
        await database.db.push("system/beta", message.guild.id, "guilds");
        await message.react(emojis.check.id);
        const msg = await message.author.send(lang.assets.join.thanks).catch(() => false);
        if (!msg) {
          message.reply(lang.assets.join.oups);
          const index = (await database.db.get("system/stats"))?.guilds.findIndex(e => e == message.guild.id);
          await database.db.remove("system/beta", "guilds", index);
        } else {
          ["892757150005342279","892756836237869106"].forEach((id) => {
            client.channels.cache.get(id)?.send({ embeds: [{
              color: "#57F287",
              title: "Un nouveau serveur as rejoint la beta",
              description: "Merci à eux de rejoindre le programme beta !",
              thumbnail: { url: message.guild.iconURL({ dynamic: true }) },
              fields: [
                { name: "Nom du serveur :", value: message.guild.name, inline: false },
                { name: "Propriétaire :", value: message.author.tag, inline: false },
              ],
              footer: { text: `${betaGuilds.guilds.length + 1} serveurs sont dans le système beta maintenant.` }
            }] }).catch(() => false)
          })
        }
        break;
      };
      case 'leave': {
        const betaGuilds = await database.db.get("system/beta");
        if (!betaGuilds.guilds.includes(message.guild.id)) return message.reply(lang.assets.leave.noInBeta);
        const index = (await database.db.get("system/beta"))?.guilds.findIndex(e => e == message.guild.id);
        await database.db.remove("system/beta", "guilds", index);
        client.guilds.cache.get("892743705834954772")?.members.kick(message.author.id, { reason: "plus dans le système beta" }).catch(() => false)
        message.reply(lang.assets.leave.success);
        ["892757150005342279","892756836237869106"].forEach((id) => {
          client.channels.cache.get(id)?.send({ embeds: [{
            color: "#ED4245",
            title: "Un serveur as quitté la beta",
            description: "Pourquoi ils nous ont quitté ? :(",
            thumbnail: { url: message.guild.iconURL({ dynamic: true }) },
            fields: [
              { name: "Nom du serveur :", value: message.guild.name, inline: false },
              { name: "Propriétaire :", value: message.author.tag, inline: false },
            ],
            footer: { text: `${betaGuilds.guilds.length - 1} serveurs sont dans le système beta maintenant.` }
          }] }).catch(() => false)
        })
        break;
      };
      default: message.reply(lang.assets.noArgs)
    }
  },
  config: { name: "beta", aliases: [], category: "config", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
  path: null
}