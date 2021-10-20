module.exports = {
    exe: async function(message, prefix, command, args, lang){
        let user = await message.guild.members.selectMember((message.content.slice(prefix.length+command.length+1) || message.author.id), { bot: true, fetch: true });
        if (args[0] && !user) return message.reply('NO_USER_FOUND'); if (user.user) user = user.user;
        message.reply({ embeds: [{
            color: message.guild.colors("embed"),
            author: { name: user.tag },
            image: { url: user.displayAvatarURL({ size: 2048, format: "png", dynamic: true }) },
            description: message.guild.translate(lang+"assets", user.displayAvatarURL({ size: 2048, format: "png", dynamic: true }))
        }] });
    },
    config: { name: "pp", aliases: ["icon", "avatar"], category: "info", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
    path: null
}