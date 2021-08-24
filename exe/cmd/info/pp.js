module.exports = {
    exe: async function(message, prefix, command, args, lang){
        let user = await message.guild.members.selectMember((message.content.slice(prefix.length+command.length+1) || message.author.id), { bot: true, fetch: true });
        if (args[0] && !user) return message.channel.send(lang.assets.noUserFound)
        if (user.user) user = user.user
        let embed = JSON.parse(JSON.stringify(lang.assets.msg)); embed.embeds[0].image.url = user.displayAvatarURL({ size: 2048, format: "png", dynamic: true }); embed.embeds[0].author.name = embed.embeds[0].author.name.replace(/{user}/g, user.tag); embed.embeds[0].description = embed.embeds[0].description.replace(/{url}/g, user.displayAvatarURL({ size: 2048, format: "png", dynamic: true }));
        message.reply(embed);
    },
    config: { name: "pp", aliases: [], category: "info", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
    path: null
}