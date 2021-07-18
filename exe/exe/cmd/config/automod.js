module.exports = {
    exe: async function(message, prefix, command, args, text){
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.inlineReply({ embed: { color: "#ED4245", description: `${config.emojis.alert.msg} **Seul les personnes avec des permissions administrateurs peuvent executer cette commande !**` } }).catch(() => false);
        const msg = await message.inlineReply({ embed: { color: "#5865F2", description: "**Quel action veux-tu effectuer ?**\n```md\n- invite\n- badword\n- spam\n- raid```", footer: { text: "Ecris \"cancel\" pour annuler l'action" } } }).catch(() => false);
        const collector = msg.createMessageCollector((m) => m.author.id == message.author.id && ["invite", "badword", "spam", "raid", "cancel"].includes(m.content.toLowerCase().trim()));

        collector.on("collect", function(m){
            m.delete().catch(() => false);
            
        });
        collector.on("end", function(){ msg.delete().catch(() => false) });
    },
    config: { name: "automod", aliases: [], category: "config", help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
    path: null
}