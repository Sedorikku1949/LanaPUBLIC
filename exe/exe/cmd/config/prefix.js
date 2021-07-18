module.exports = {
    exe: async function(message, prefix, command, args, text){
        if (!guilds.get(message.guild.id)) return message.inlineReply({ embed: { color: "#ED4245", description: `${config.emojis.alert.msg} ** Une erreur est survenue en chargeant la base de donnée.**` } });
        if (!args[0]) return message.inlineReply({ embed: { color: "#ED4245", description: `${config.emojis.alert.msg} **Tu n'as spécifié(e) aucun nouveau préfix !**` } })
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.inlineReply({ embed: { color: "#ED4245", description: `${config.emojis.alert.msg} **Seul les personnes avec des permissions administrateurs peuvent executer cette commande !**` } });
        if (args[0].match(/[0-9]/g, "")) return message.inlineReply({ embed: { color: "#ED4245", description: `${config.emojis.alert.msg} **Mon nouveau préfix ne peut pas contenir de chiffres !**` } })
        const msg = await message.inlineReply({ embed: { color: "#57F287", description: `**Veux-tu que mon nouveau préfix sur ce serveur soit "${args[0].replace(/[0-9]/g, "")}" ?**` } })
        await Promise.all([config.emojis.check.id, config.emojis.close.id].map((e) => msg.react(e)))
        const collector = msg.createReactionCollector((react, user) => [config.emojis.check.id, config.emojis.close.id].includes(react.emoji.id) && user.id == message.author.id, { time: 30000 });
        collector.on("collect", (react) => {
            switch(react.emoji.id){
                case config.emojis.check.id: {
                    /* modifier le préfix */ guilds.set(message.guild.id, args[0].replace(/[0-9]/g, ""), '["_config"].prefix'); msg.edit({ embed: { color: "#57F287", description: `${config.emojis.like.msg} **Mon nouveau préfix est désormais :** ${args[0].replace(/[0-9]/g, "")}` } }).catch(() => false); collector.stop(); break;
                };
                case config.emojis.close.id: {
                    /* annulation de l'action */ msg.edit({ embed: { color: "#57F287", description: `${config.emojis.cancel.msg} **Annulation de l'action.**` } }).catch(() => false); collector.stop(); break;
                };
            }
        })
        collector.on("end", () => msg.reactions.removeAll().catch(() => false))
    },
    config: { name: "prefix", aliases: [], category: "config", help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
    path: null
}