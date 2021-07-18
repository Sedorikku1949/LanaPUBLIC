function checkPing(ping) {
    if (ping < 150) return "excellent";
    else if (ping < 250) return "correcte";
    else if (ping < 400) return "médiocre";
    else if (ping < 1000) return "limite";
    else return "horrible !";
}

module.exports = {
    exe: async function(message, prefix, command, args, text){
        let i = Date.now();
        await message.channel.send({ embed: { color: "#2c2f33", title: "Récupération de données..."} }).then((msg) => { msg.delete() })
        i = Date.now() - i
        message.inlineReply({ embed: {
            color: "#5865F2",
            footer: { text: "© Lana - 2021" },
            thumbnail: { url: client.user.displayAvatarURL({ size: 2048, format: "png" }) },
            fields: [
                { name: "Discord :", value: "```\n"+i+"ms, c'est "+checkPing(i)+"```", inline: true },
                { name: "Lana :", value: "```\n"+client.ws.ping+"ms, c'est "+checkPing(client.ws.ping)+"```"}
            ]
        }})
    },
    config: { name: "ping", aliases: [], category: "info", help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
    path: null
}