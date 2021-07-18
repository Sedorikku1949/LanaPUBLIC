module.exports = {
    exe: function(message, prefix, command, args, text){
        message.inlineReply({ embed: {
            color: "#5865F2",
            footer: { text: "© Lana - 2021" },
            thumbnail: { url: client.user.displayAvatarURL({ size: 2048, format: "png" }) },
            title: "Invite moi dès maintenant avec le lien de ton choix !",
            description: ">>> **Permissions personnalisables : [clique ici](https://discord.com/oauth2/authorize?client_id=858766319506554899&scope=bot&permissions=-1)**\n**Permissions administrateurs : [clique ici](https://discord.com/oauth2/authorize?client_id=858766319506554899&scope=bot&permissions=8)**\n**Aucune permission : [clique ici](https://discord.com/oauth2/authorize?client_id=858766319506554899&scope=bot&permissions=0)**"
        }})
    },
    config: { name: "invite", aliases: [], category: "info", help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
    path: null
}