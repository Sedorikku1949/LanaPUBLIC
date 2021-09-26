const slashCommands = require("../../../functions/Class/slashCommands");

const chatChannelNames = ["discussion", "general", "général", "géneral", "genéral", "chat"];

async function mpOwner(guild, joinMessage){
    client.users.cache.get(guild.ownerId)?.send(joinMessage).catch(() => false)
};

module.exports = async function(guild){
    try {
        let joinMessage = JSON.parse(JSON.stringify(database.language.fr.misc.guildCreate));
        joinMessage.embeds[0].thumbnail.url = guild.iconURL({size:2048,format:"png",dynamic:true})
        joinMessage.embeds[0].author.name = joinMessage.embeds[0].author.name.replace(/{name}/, client.user.tag);
        joinMessage.embeds[0].author.icon_url = client.user.displayAvatarURL({size:2048,format:"png"});
        joinMessage.embeds[0].description = joinMessage.embeds[0].description.replace(/{guildName}/, guild.name.slice(0,200))
        joinMessage.embeds[0].footer.text = joinMessage.embeds[0].footer.text.replace(/{prefix}/, client.prefix);

        // database
        let db = config.bdd.guilds;
        db.id = guild.id;
        database.db.set("guild/"+guild.id, db);

        await guild.members.fetch();
        await slashCommands.loadGuild(guild);

        // message de join sur le new serveur
        if (guild.channels.cache.length <= 0) { mpOwner(guild, joinMessage); } // mp le fonda car il n'y a aucun salon
        else {
            if (guild.channels.cache.find(e => chatChannelNames.some(chl => e.name.match(chl)) )) {
                const chl = guild.channels.cache.find(e => chatChannelNames.some(chl => e.name.match(chl)) );
                if (!chl) return mpOwner(guild, joinMessage);
                chl.send(joinMessage).catch(()=>false)
            } else {
                /*let msg = false;
                let list = []; guild.channels.cache.array()
                if (Array.isArray(list)) list = list.filter(e => e.type == "text").sort((a,b) => a.rawPosition - b.rawPosition);
                else list = [];
                while(list.length > 0 && !msg) {
                    const res = await list[0].send(joinMessage).catch(() => false);
                    if (!res) { list = list.slice(1) }
                    else { msg = true };
                };
                if (!msg) */mpOwner(guild, joinMessage);
            };
        };

        // logs de join
        client.channels.cache.get(config.dev.newServerChannel).send({
            embeds: [{
                color: "#19FF77",
                title: "J'ai été ajoutée sur un nouveau serveur !",
                thumbnail: { url: guild.iconURL({ size: 2048, dynamic: true, format: "png" }) },
                fields: [
                    { name: "Nom du serveur :", value: guild.name.slice(0,1900), inline: false },
                    { name: "Owner :", value: client.users.cache.get(guild.ownerId)?.tag || "...", inline: false},
                    { name: "Quelques infos :", value: `Membres : \`${guild.memberCount}\`\nBots : \`${guild.members.cache.filter(e => e.user.bot).size}\`\nSalons : \`${guild.channels.cache.size}\``, inline: false },
                    { name: "Date de création :", value: getDate(guild.createdTimestamp, "[DD]/[MM]/[YYYY]")}
                ],
                footer: { text: `Je suis maintenant sur ${client.guilds.cache.size} serveurs !` },
                timestamp: Date.now(),
            }]
        }).then(e => e.react("💖"))
    } catch(err) {}
};