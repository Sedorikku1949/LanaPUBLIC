module.exports = {
    exe: async function(message, prefix, command, args, lang){
        if (!(await database.db.get("guild/"+message.guild.id))) return message.reply(lang.assets.databaseError);
        if (!args[0]) return message.reply(lang.assets.noArgs)
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply(lang.assets.notAdmin);
        if (args[0].match(/[0-9]/g, "")) return message.reply(lang.assets.invalidArgs)
        let question = JSON.parse(JSON.stringify(lang.assets.question)); question.embeds[0].description = question.embeds[0].description.replace(/{prefix}/, args[0].replace(/[0-9]/g, ""));
        const msg = await message.reply(question)
        await Promise.all([emojis.check.id, emojis.close.id].map((e) => msg.react(e)))
        const collector = msg.createReactionCollector({ time: 30000, filter: (react, user) => [emojis.check.id, emojis.close.id].includes(react.emoji.id) && user.id == message.author.id });
        collector.on("collect", async(react) => {
            switch(react.emoji.id){
                case emojis.check.id: {
                    /* modifier le préfix */
                    await database.db.set("guild/"+message.guild.id, args[0].replace(/[0-9]/g, ""), 'prefix');
                    let res = JSON.parse(JSON.stringify(lang.assets.res)); res.embeds[0].description = res.embeds[0].description.replace(/{prefix}/, args[0].replace(/[0-9]/g, ""))
                    msg.edit(res).catch(() => false);
                    collector.stop(); break;
                };
                case emojis.close.id: {
                    /* annulation de l'action */ msg.edit(lang.assets.cancel).catch(() => false); collector.stop(); break;
                };
            }
        })
        collector.on("end", () => msg.reactions.removeAll().catch(() => false))
    },
    config: { name: "prefix", aliases: [], category: "config", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
    path: null
}