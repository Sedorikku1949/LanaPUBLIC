module.exports = {
  exe: async function(message, prefix, command, args, text){
    const msg = await message.channel.send({ embeds: [{ color: "#5865F2", description: `${emojis.warningButton.msg}   **Veux-tu réellement me rechargée ?**` }] })
    await Promise.all([emojis.check.id, emojis.close.id].map((e) => msg.react(e)))
    const collector = msg.createReactionCollector({ time: "30000", filter: (react, user) => react.emoji.id && [emojis.check.id, emojis.close.id].includes(react.emoji.id) && user.id == message.author.id })
    collector.on("collect", async(react) => {
      switch(react.emoji.id) {
        case emojis.check.id: {
          await msg.reactions.removeAll().catch(() => false)
          // yes
          config.reload = { msg: msg.id, channel: msg.channel.id }
          await msg.edit({ embeds: [{ color: "#5865F2", description: `${emojis.reload.msg} **Rechargement de LanaV3.0...**` }] })
          await deleteCache(require.resolve("../../managers/eventsManager.js"))
          await deleteCache(require.resolve("../../managers/commandsManager.js"))
          await reloadAllCache()
          require("../../managers/eventsManager.js").reload()
          collector.stop()
          break;
        };
        case emojis.close.id: {
          // no
          msg.edit({ embeds: [{ color: "#5865F2", description: `${emojis.error.msg} **Action annulée !**` }] })
          collector.stop()
          break;
        }
      }
    })
    collector.on("end", () => msg.reactions.removeAll().catch(() => false))
  },
  config: { name: "reload", aliases: ["restart"], category: "dev", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: true } },
  path: null
}