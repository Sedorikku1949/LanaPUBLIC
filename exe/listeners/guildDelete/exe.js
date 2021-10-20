module.exports = async function(guild){
    await database.clientStats.guildDelete(guild);
    database.db.delete(guild.id)

    discordbotlist();

    // leave logs
    client.channels.cache.get(config.dev.newServerChannel).send({
        embeds: [{
            color: "#FF1943",
            title: "J'ai été retirée d'un serveur...",
            thumbnail: { url: guild.iconURL({ size: 2048, dynamic: true, format: "png" }) },
            fields: [
                { name: "Nom du serveur :", value: guild.name.slice(0,1900), inline: false },
                { name: "Owner :", value: client.users.cache.get(guild.ownerId)?.tag || "....", inline: false},
                { name: "Quelques infos :", value: `Membres : \`${guild.memberCount}\`\nBots : \`${guild.members.cache.filter(e => e.user.bot).size}\`\nSalons : \`${guild.channels.cache.size}\``, inline: false },
                { name: "Date de création :", value: getDate(guild.createdTimestamp, "[DD]/[MM]/[YYYY]")}
            ],
            footer: { text: `Je suis maintenant sur ${client.guilds.cache.size} serveurs...` },
            timestamp: Date.now(),
        }]
    }).then(e => e.react("💔"))
}