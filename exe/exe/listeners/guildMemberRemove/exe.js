const Discord = require("discord.js")

async function replaceBalise(str, member){
    if (!(member instanceof Discord) )
    return str.replace(/{(username|usertag|mention|memberCount|)}/g, function(a, _){
        switch(a){
            case "username": return member.user.username;
            case "usertag": return member.user.tag;
            case "mention": return member.user.toString();
            case "memberCount": return member.guild.memberCount
        }
    })
}

module.exports = function(member){
    /* message */
    if (guilds.get(member.guild) && guilds.get(member.guild).channels.leave){
        const chl = client.channels.cache.get(guilds.get(member.guild).channels.leave);
        if (!chl || !guilds.get(member.guild).messages.leave || guilds.get(member.guild).messages.leave.length <= 0 ) return;
        chl.send(guilds.get(member.guild).messages.leave)
    };

    /* invite */
};