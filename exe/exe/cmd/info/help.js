function getCategoryBar(list){ return list.map((e) => { return list.map(l => { if (l == e) { return `[ ${l} ]`; } else { return l; } }).join(" / "); }); };
function findAllCategories(list){ let res = []; list.forEach(cmd => { if (!res.includes(cmd.config.category)) { res.push(cmd.config.category) } else return; }); return res; }
function increase(x, embed) { return x >= embed.length - 1 ? 0 : x + 1 }
function decrease(x, embed) { return x <= 0 ? x = embed.length - 1 : x - 1 }


async function sendSpecificCommandHelp(msg, cmd, message){
    const embed = { embed: {
        color: "#5865F2", title: `Page d'aide de la commande "${cmd.config.name}":`, thumbnail: { url: client.user.displayAvatarURL({ size: 2048, format: "png" }) }, footer: { text: "© Lana - 2021"},
        fields: [
            { name: "Catégorie :", value: "```\n"+cmd.config.category+"```", inline: true}, { name: "Aliase(s) :", value: "```\n"+(cmd.config.aliases.length > 0 ? cmd.config.aliases.join(" / ") : "Aucun.")+"```", inline: true},
            { name: "Description :", value: "```\n"+cmd.config.help.desc+"```", inline: false}, { name: "Utilisation :", value: "```\n"+cmd.config.help.use+"```", inline: false},
        ], 
    }}
    if (!msg) message.inlineReply(embed)
    else msg.edit(embed)
}

module.exports = {
    exe: async function(message, prefix, command, args, text){
        if (!args[0]) { // page général
            const categoryList = findAllCategories(commands); const categoryPagePosition = getCategoryBar(categoryList);
            const embedList = categoryList.map(ctg => {
                const index = categoryList.findIndex(e => e == ctg);
                return ({ embed: {
                    color: "5865F2", author: { icon_url: client.user.displayAvatarURL({size:2048, format: "png"}), name: "Liste des commandes."}, footer: { text: "© Lana - 2021"},
                    description: "```\n"+(categoryPagePosition[index])+"```\n```\n➯ "+(commands.filter(e => e.config.category == ctg).map(e => e.config.name).join("\n➯ "))+"```",
                }})
            });

            let [x, msg] = [0, await message.inlineReply(embedList[0])]
            await Promise.all([config.emojis.search.id, config.emojis.undo.id, config.emojis.redo.id, config.emojis.cancel.id].map((e) => msg.react(e).catch(()=>false)))
            const collector = msg.createReactionCollector((react, user) => [config.emojis.search.id, config.emojis.undo.id, config.emojis.redo.id, config.emojis.cancel.id].includes(react.emoji.id) && user.id == message.author.id,{ time: 60000 })

            collector.on("collect", async function(react){
                switch(react.emoji.id){
                    case config.emojis.search.id:{ /* search */ 
                        await msg.reactions.removeAll(); await msg.edit({ embed: { color: "5865F2", description: "**Quel commande veux-tu chercher ?**" } })
                        const c = message.channel.createMessageCollector((m) => m.author.id == message.author.id, { time: 60000 })
                        c.on("collect", async function(m){
                            const cmd = commands.find((cmd) => cmd.config.name == m.content.toLowerCase() || (cmd.config.aliases.length > 0 && cmd.config.aliases.includes(m.content.toLowerCase())));
                            if (!cmd) message.channel.send({ embed: { color: "5865F2", description: `${config.emojis.search.msg} **Je n'ai pas trouvée cette commande.**` } })
                            else sendSpecificCommandHelp(msg, cmd, message);
                            m.delete().catch(() => {}) && c.stop();
                        })
                        c.on("end", function(){});
                        break;
                    };
                    case config.emojis.undo.id:{/* undo */ x = decrease(x, embedList); msg.edit(embedList[x]).catch(() => false); react.users.remove(message.author.id).catch(() => 0); break;};
                    case config.emojis.redo.id:{ /* redo */ x = increase(x, embedList); msg.edit(embedList[x]).catch(() => false); react.users.remove(message.author.id).catch(() => 0); break; };
                    case config.emojis.cancel.id:{ /* cancel */ collector.stop(); break; }
                }
            });

            collector.on("end", () => msg.reactions.removeAll().catch(() => false))

        } else {
            const cmd = commands.find((cmd) => cmd.config.name == message.content.slice(prefix.length+command.length+1).toLowerCase() || (cmd.config.aliases.length > 0 && cmd.config.aliases.includes(message.content.slice(prefix.length+command.length+1).toLowerCase())));
            if (!cmd) return message.channel.send({ embed: { color: "5865F2", description: `${config.emojis.search.msg} **Je n'ai pas trouvée cette commande.**` } })
            else sendSpecificCommandHelp(null, cmd, message)
        }
    },
    config: { name: "help", aliases: ["h"], category: "info", help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
    path: null
}