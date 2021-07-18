const chatChannelNames = ["discussion", "general", "général", "géneral", "genéral", "chat"];

async function mpOwner(guild){
    guild.owner.send(joinMessage).cacth(() => false)
};

module.exports = async function(guild){

    const joinMessage = { embed: {
        thumbnail: { url: client.user.displayAvatarURL({ size: 2048, dynamic: true, format: "png" }) },
        color: "#5865F2",
        title: "Merci de m'avoir ajoutée sur votre serveur !",
        timestamp: Date.now(),
        description: "```md\n# En m'ajoutant sur votre serveur, vous offre à votre communauté un bot de modération, gestion, de fun, et d'information très puissant !```\n**Ma particularité est que je suis personnalisable à fond et que je propose des options que aucun autre bot ne propose !**\n\n> Pour m'activer sur le serveur, tu peux écrire \"=enable\" !\n** **",
        footer: { text: "© Lana - 2021" },
        fields: [{name: "Mon serveur support :", value: "**[\[Clique ici pour voir mon serveur support \]](https://discord.gg)**", inline: true}, { name: "M'ajouter sur un autre serveur :", value: "**[\[ Clique ici pour m'inviter \]](https://discord.com/oauth2/authorize?client_id=858766319506554899&scope=bot&permissions=-1)**", inline: true}],
    }};

    // database
    let db = config.bdd.guilds;
    db.id = guild.id;
    guilds.ensure(guild.id, db);

    // message de join sur le new serveur
    if (guild.channels.cache.length <= 0) { mpOwner(guild); } // mp le fonda car il n'y a aucun salon
    else {
        if (guild.channels.cache.find(e => chatChannelNames.some(chl => e.name.match(chl)) )) {
            const chl = guild.channels.cache.find(e => chatChannelNames.some(chl => e.name.match(chl)) );
            if (!chl) return mpOwner(guild);
            chl.send(joinMessage)
        } else {
            let msg = false;
            let list = guild.channels.cache.array().filter(e => e.type == "text").sort((a,b) => a.rawPosition - b.rawPosition);
            while(list.length > 0 && !msg) {
                const res = await list[0].send(joinMessage).catch(() => false);
                if (!res) { list = list.slice(1) }
                else { msg = true };
            };
            if (!msg) mpOwner(guild);
        };
    };

    // logs de join
    client.channels.cache.get(config.dev.newServerChannel).send({
        embed: {
            color: "#19FF77",
            title: "J'ai été ajoutée sur un nouveau serveur !",
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
};