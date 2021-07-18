module.exports = {
    exe: async function(message, prefix, command, args, text){
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.inlineReply({ embed: { color: "#ED4245", description: `${config.emojis.alert.msg} **Seul les personnes avec des permissions administrateurs peuvent executer cette commande !**` } });
        if (!guilds.get(message.guild.id)) return message.channel.send({ embed: { color: "#ED4245", description: `${config.emojis.alert.msg} ** Une erreur est survenue en chargeant la base de donnée.**` } });
        if (guilds.get(message.guild.id)["_config"].enable) return message.channel.send({ embed: { color:  "#ED4245", description: `${config.emojis.alert.msg} ** Je suis déjà activée sur ce serveur.**` } })
        guilds.set(message.guild.id, true, "['_config'].enable" )
        message.inlineReply({ embed: { color: "#57F287", description: `${config.emojis.like.msg} ** J'ai été activée avec succès !**`, footer: { text: 'Pour me configurer, écris "=setup" !' } } })
        if ( !message.channel.permissionsFor(client.user.id).toArray().includes("ADMINISTRATOR") ) message.channel.send({ embed: { color: "#ED4245", description: `${config.emojis.alert.msg} **Je te recommande de m'attribuer les permission administrateurs pour que je puisse fonctionner à mon potentielle maximale.**` } })
    },
    config: { name: "enable", aliases: [], category: "config", help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
    path: null
}