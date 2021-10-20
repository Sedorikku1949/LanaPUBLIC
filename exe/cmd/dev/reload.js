module.exports = {
  exe: async function(message, prefix, command, args, lang){
  switch(args[0]){
      case "commands": {
        const msg = await message.channel.send({ embeds: [{ color: "#5865F2", description: `${emojis.reload.msg} **Rechargement des commandes...**` }] })
        const res = database.Client.reloadCommands();
        if (res) msg.edit({ embeds: [{ color: "#5865F2", description: `${emojis.check.msg} **Les commandes ont bien été rechargés !**` }] })
        else msg.edit({ embeds: [{ color: message.guild.colors("error"), description: `${emojis.check.msg} **Une erreur est survenue !**\n\`\`\`js\n${res}\`\`\`` }] })
        break;
      };
      case "prototypes": {
        const msg = await message.channel.send({ embeds: [{ color: "#5865F2", description: `${emojis.reload.msg} **Rechargement des prototypes...**` }] })
        const res = database.Client.reloadPrototypes();
        if (res) msg.edit({ embeds: [{ color: "#5865F2", description: `${emojis.check.msg} **Les prototypes ont bien été rechargés !**` }] })
        else msg.edit({ embeds: [{ color: message.guild.colors("error"), description: `${emojis.check.msg} **Une erreur est survenue !**\n\`\`\`js\n${res}\`\`\`` }] })
        break;
      };
      case "functions": {
        const msg = await message.channel.send({ embeds: [{ color: "#5865F2", description: `${emojis.reload.msg} **Rechargement des fonctions...**` }] })
        const res = database.Client.reloadFunctions();
        if (res) msg.edit({ embeds: [{ color: "#5865F2", description: `${emojis.check.msg} **Les fonctions ont bien été rechargés !**` }] })
        else msg.edit({ embeds: [{ color: message.guild.colors("error"), description: `${emojis.check.msg} **Une erreur est survenue !**\n\`\`\`js\n${res}\`\`\`` }] })
        break;
      };
      case "events": {
        const msg = await message.channel.send({ embeds: [{ color: "#5865F2", description: `${emojis.reload.msg} **Rechargement des events...**` }] })
        const res = database.Client.reloadEvents();
        if (res) msg.edit({ embeds: [{ color: "#5865F2", description: `${emojis.check.msg} **Les events ont bien été rechargés !**` }] })
        else msg.edit({ embeds: [{ color: message.guild.colors("error"), description: `${emojis.check.msg} **Une erreur est survenue !**\n\`\`\`js\n${res}\`\`\`` }] })
        break;
      };
      case "langs": {
        const msg = await message.channel.send({ embeds: [{ color: "#5865F2", description: `${emojis.reload.msg} **Rechargement des fichiers de langues...**` }] })
        const res = database.Client.reloadLangs();
        if (res) msg.edit({ embeds: [{ color: "#5865F2", description: `${emojis.check.msg} **Les fichiers de langues ont bien été rechargés !**` }] })
        else msg.edit({ embeds: [{ color: message.guild.colors("error"), description: `${emojis.check.msg} **Une erreur est survenue !**\n\`\`\`js\n${res}\`\`\`` }] })
        break;
      };
      case "all": {
        // yes
        const msg = await message.channel.send({ embeds: [{ color: "#5865F2", description: `${emojis.reload.msg} **Rechargement de ${client.user.tag}...**` }] })
        database.Client.reload = { msg: msg.id, channel: msg.channel.id };
        database.Client.reloadAll();
        break;
      };
    }
  },
  config: { name: "reload", aliases: ["restart"], category: "dev", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: true } },
  path: null
}