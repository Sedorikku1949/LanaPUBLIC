module.exports = {
    exe: async function(message, prefix, command, args, text){
        const msg = await message.channel.send({ embed: { color: "#5865F2", description: `${config.emojis.warningButton.msg}   **Veux-tu réellement me rechargée ?**` } })
        await Promise.all([config.emojis.check.id, config.emojis.close.id].map((e) => msg.react(e)))
        const collector = msg.createReactionCollector((react, user) => react.emoji.id && [config.emojis.check.id, config.emojis.close.id].includes(react.emoji.id) && user.id == message.author.id, { time: "30000" })
        collector.on("collect", async(react) => {
            switch(react.emoji.id) {
                case config.emojis.check.id: {
                    await msg.reactions.removeAll().catch(() => false)
                    // yes
                    config.reload = { msg: msg.id, channel: msg.channel.id }
                    await msg.edit({ embed: { color: "#5865F2", description: `${config.emojis.reload.msg} **Rechargement de LanaV3.0...**` } })
                    await deleteCache(require.resolve("../../managers/eventsManager.js"))
                    await deleteCache(require.resolve("../../managers/commandsManager.js"))
                    await reloadAllCache()
                    require("../../managers/eventsManager.js")
                    collector.stop()
                    break;
                };
                case config.emojis.close.id: {
                    // no
                    msg.edit({ embed: { color: "#5865F2", description: `${config.emojis.cancel.msg} **Action annulée !**` } })
                    collector.stop()
                    break;
                }
            }
        })
        collector.on("end", () => msg.reactions.removeAll().catch(() => false))
    },
    config: { name: "reload", aliases: ["restart"], category: "dev", help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: true } },
    path: null
}