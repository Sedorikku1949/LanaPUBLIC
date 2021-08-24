function expliciteFilter(str){
    switch(str){
        case "DISABLED": return "Désactivé.";
        case "MEMBERS_WITHOUT_ROLES": return "Les membres sans rôles.";
        case "ALL_MEMBERS": return "Tout le monde.";
    }
}

function verificationLevel(str){
    switch(str){
        case "NONE": return "Aucune restriction.";
        case "LOW": return "Necessite une adresse mail vérifiée.";
        case "MEDIUM": return "Doit être inscrit sur discord depuis 5m.";
        case "HIGH": return "Doit être membre du serveur depuis 10m.";
        case "VERY_HIGH": return "Doit avoir un numéro de téléphone vérifié."
    }
}

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    const d = new date(message.guild.createdTimestamp); const l = clone(await database.db.get("user/"+message.author.id) ? (database.language[await database.db.get("user/"+message.author.id).lang] || database.language.fr) : database.language.fr );
    const embed = JSON.parse(JSON.stringify(lang.assets));
    embed.embeds[0].title = embed.embeds[0].title.replace(/{guildName}/, message.guild.name.slice(0,240));
    embed.embeds[0].thumbnail.url = (message.guild.iconURL() ? message.guild.iconURL({ size: 2048, dynamic: true, format: "png" }) : "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png");
    embed.embeds[0].fields[0].value = embed.embeds[0].fields[0].value.replace(/{ownerMention}/,message.guild.ownerId).replace(/{ownerTag}/,message.guild.members.selectMember(message.guild.ownerId).displayName);
    embed.embeds[0].fields[1].value = embed.embeds[0].fields[1].value.replace(/{creationDate}/, d.date).replace(/{creationDuration}/, d.durationToNow);
    embed.embeds[0].fields[2].value = message.guild.afkChannelID ? (embed.embeds[0].fields[2].value.replace(/{afkChannel}/, client.channels.cache.get(message.guild.afkChannelID).name).replace(/{afkTime}/, (new date(Date.now()-(Number(message.guild.afkTimeout+"000")) )).durationToNow)) : l.misc.servCommands.noAFKChannel;
    embed.embeds[0].fields[3].value = message.guild.premiumSubscriptionCount > 0 ? (embed.embeds[0].fields[3].value.replace(/{boostNumber}/, message.guild.premiumSubscriptionCount).replace(/{boostLevel}/, "T"+message.guild.premiumTier.toLowerCase().trim().replace(/_/g, " ").slice(1))) : l.misc.servCommands.noBoost;
    embed.embeds[0].fields[4].value = embed.embeds[0].fields[4].value.replace(/{human}/, message.guild.memberCount - message.guild.members.cache.filter(e => e.user.bot).size).replace(/{bot}/, message.guild.members.cache.filter(e => e.user.bot).size).replace(/{total}/, message.guild.memberCount)
    embed.embeds[0].fields[5].value = embed.embeds[0].fields[5].value.replace(/{category}/, message.guild.channels.cache.filter(e => e.type == "GUILD_CATEGORY").size).replace(/{textuel}/, message.guild.channels.cache.filter(e => e.type == "GUILD_TEXT").size).replace(/{vocal}/, message.guild.channels.cache.filter(e => e.type == "GUILD_VOICE").size).replace(/{news}/, message.guild.channels.cache.filter(e => e.type == "GUILD_NEWS").size)
    embed.embeds[0].fields[6].value = embed.embeds[0].fields[6].value.replace(/{systemChannel}/, message.guild.systemChannel ? message.guild.systemChannel.toString() : l.misc.servCommands.noSystemChannel).replace(/{explicitFilter}/, expliciteFilter(message.guild.explicitContentFilter)).replace(/{rules}/, message.guild.rulesChannelId ? client.channels.cache.get(message.guild.rulesChannelId).toString() : l.misc.servCommands.noRuleChannel ).replace(/{verificationLevel}/, verificationLevel(message.guild.verificationLevel))

    message.reply(embed)
  },
  config: { name: "serv", aliases: ["server", "si", "serverinfo"], category: "info", system: { perms: ["SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}