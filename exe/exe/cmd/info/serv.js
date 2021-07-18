function getRegion(guild){
    let res = guild;
    switch(guild){
        case "europe": { res = "Europe"; break; };
    };
    return res;
};

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
    exe: async function(message, prefix, command, args, text){
        message.inlineReply({ embed: {
            color: "#FF395D",
            title: `Informations sur ${message.guild.name.slice(0,240)} :`,
            footer: { text: "© Lana - 2021" }, thumbnail: { url: message.guild.iconURL() ? message.guild.iconURL({ size: 2048, dynamic: true, format: "png" }) : "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png" },
            fields: [
                { name: "Owner :", value: `**${message.guild.owner.user.toString()} / ${message.guild.owner.displayName}**`, inline: false },
                { name: "Région :", value: "```\n"+getRegion(message.guild.region)+"```", inline: true },
                { name: "AFK :", value: "```\n"+(message.guild.afkChannelID ? `Salon AFK : ${client.channels.cache.get(message.guild.afkChannelID).name}\nTemps : ${(new date(Date.now()-(Number(message.guild.afkTimeout+"000")) )).durationToNow}` : "Aucun salon afk n'a été configuré.")+"```", inline: false },
                { name: "Boost :", value: "```\n"+(message.guild.premiumSubscriptionCount ? `Nombre de boosts : ${message.guild.premiumSubscriptionCount}\nNiveau de boost : ${message.guild.premiumTier}` : "Aucun boost.")+"```", inline: true},
                { name: "Communautée :", value: "```\n"+`➤ Humains : ${message.guild.memberCount - message.guild.members.cache.filter(e => e.user.bot).size}\n➤ Bots : ${message.guild.members.cache.filter(e => e.user.bot).size}\n➤ Total : ${message.guild.memberCount}`+"```", inline: true},
                { name: "Salons :", value: `<:category:861216210921848883> **Catégories :** ${message.guild.channels.cache.filter(e => e.type == "category").size}\n<:textuel:861216210887770134> **Salons textuels :** ${message.guild.channels.cache.filter(e => e.type == "text").size}\n<:vocal:861216210879119360> **Salons vocaux :** ${message.guild.channels.cache.filter(e => e.type == "voice").size}\n<:annonce:861216210851332118> **Salons d'annonces :** ${message.guild.channels.cache.filter(e => e.type == "news").size}\n**\u200b**`, inline: false},
                { name: "Other :", value: `**Salon d'annonce :** ${message.guild.systemChannelID ? client.channels.cache.get(message.guild.systemChannelID).toString() : "Aucun."}\n**Filtre explicite :** ${expliciteFilter(message.guild.explicitContentFilter)}\n**Niveau de verification :** ${verificationLevel(message.guild.verificationLevel)}\n**Salon des règles :** ${message.guild.rulesChannelID ? client.channels.cache.get(message.guild.rulesChannelID).toString() : "Aucun." }`, inline: true}
            ]
        }})
    },
    config: { name: "serv", aliases: ["server", "si", "serverinfo"], category: "info", help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
    path: null
}