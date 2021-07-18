module.exports = function(guild){

    guilds.delete(guild.id)

    // leave logs
    client.channels.cache.get(config.dev.newServerChannel).send({
        embed: {
            color: "#FF1943",
            title: "J'ai été retirée d'un serveur...",
            thumbnail: { url: guild.iconURL({ size: 2048, dynamic: true, format: "png" }) },
            fields: [
                { name: "Nom du serveur :", value: guild.name.slice(0,1900), inline: true },
                { name: "Owner :", value: guild.owner.user.toString(), inline: true},
                { name: "Quelques infos :", value: `Membres : \`${guild.memberCount}\`\nBots : \`${guild.members.cache.filter(e => e.user.bot).size}\`\nSalons : \`${guild.channels.cache.size}\``, inline: true },
                { name: "Date de création :", value: getDate(guild.createdTimestamp, "[DD]/[MM]/[YYYY]")}
            ],
            timestamp: Date.now(),
        }
    })
}