
async function reset(message, prefix, command, args, msg){
    const me = await msg.channel.send({ embed: { color: "#57F287", description: "**Est-tu sûr de réinitialiser ma base de donnée ?** Cette action n'est pas réversible." } })
    await Promise.all([config.emojis.check.id, config.emojis.close.id].map(e => me.react(e).catch(() => false)))
    const collector = me.createReactionCollector((react, user) => [config.emojis.check.id, config.emojis.close.id].includes(react.emoji.id), { time: 30000 });
    let a = false;
    collector.on("collect", function(react){
        a = true;
        me.delete().catch(() => false)
        switch(react.emoji.id){
            case config.emojis.check.id: {
                let data = config.bdd.guilds
                data.id = message.guild.id
                guilds.set(message.guild.id, data)
                message.channel.send({ embed: { color: "#57F287", description: "**La base de donnée du serveur a été réinitialisée avec succès !**", footer: { text: "J'ai automatiquement été désactivée, écrivez \"=enable\" pour me réactiver." } } });
                collector.stop();
                break;
            };
            case config.emojis.close.id: {
                message.channel.send({ embed: { color: "#57F287", description: "**Cancel.**" } }).catch(() => false);
                collector.stop();
                break;
            };
        };
    });

    collector.on("end", function(){ me.reactions.removeAll().catch(() => false); if (!a) message.channel.send({ embed: { color: "#57F287", description: "**Le temps impartie est écoulé, l'action est annulée.**" } }).catch(() => false); })
}

module.exports = {
    exe: async function(message, prefix, command, args, text){
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.inlineReply({ embed: { color: "#ED4245", description: `${config.emojis.alert.msg} **Seul les personnes avec des permissions administrateurs peuvent executer cette commande !**` } });
        const msg = await message.inlineReply({ embed: { color: "#5865F2", description: "**Quel action veux-tu effectuer sur la base de donnée ?**\n```\nsee\nreset\ncancel```" } }).catch(() => false);
        const collector = message.channel.createMessageCollector((m) => m.author.id == message.author.id && ["see", "reset", "cancel"].includes(m.content.toLowerCase().trim()),{ time: 60000 });
        collector.on("collect", function(m){
            switch(m.content.toLowerCase().trim()){
                case "see": {
                    const str = require("util").inspect(guilds.get(message.guild.id));
                    msg.delete().catch(() => false);
                    message.channel.send("**Données stockées concernant le serveur :**```js\n"+(str.slice(0,1950)).replace(/\`/g, "\u200b`")+"```").catch(() => false);
                    collector.stop()
                    break;
                };
                case "reset": {
                    if (message.author.id !== message.guild.owner.id) return message.channel.send({ embed: { color: "#ED4245", description: "**Seul le/la fondateur/trice peut reset la base de donnée du serveur.**" } })
                    reset(message, prefix, command, args, msg);
                    collector.stop()
                    break;
                };
                case "cancel": {
                    m.delete().catch(() => false);
                    message.channel.send({ embed: { color: "#57F287", description: "**Cancel.**" } }).catch(() => false);
                    collector.stop();
                    break;
                }
            }
        });
        collector.on("end", function(){ msg.delete().catch(() => false) })
    },
    config: { name: "data", aliases: [], category: "config", help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
    path: null
}