module.exports = {
    exe: async function(message, prefix, command, args, text){
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.inlineReply({ embed: { color: "#ED4245", description: `${config.emojis.alert.msg} **Seul les personnes avec des permissions administrateurs peuvent executer cette commande !**` } });
        if (!guilds.get(message.guild.id)) return message.channel.send({ embed: { color: "#ED4245", description: `${config.emojis.alert.msg} ** Une erreur est survenue en chargeant la base de donnée.**` } });
        guilds.set(message.guild.id, false, "['_config'].enable" )
        message.channel.send({ embed: { color: "#57F287", description: `${config.emojis.like.msg} ** J'ai été désactivée avec succès !**`, footer: { text: 'Pour me réactivée, écris "=enable" !' } } })
    },
    config: { name: "disable", aliases: [], category: "config", help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
    path: null
}