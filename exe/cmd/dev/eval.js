async function exit(string){
    let text = string
    if (typeof text !== 'string') text = String(require('util').inspect(string, true, 0))
    return text
        .replace(new RegExp(`${client.token}|client\.token|\@|token`, "g"), (one, two) => {
            if (![client.token, "client.token", "@"].includes(one)) return one
            switch (one) {
                case "client.token": return "'Tok3n <3'";
                case client.token: return "'Tok3n <3'";
                case "@": return "@\u200b";
                case "token": return "'tokenn'"
            }
        }).slice(0, 1986)       
};


module.exports = {
    exe: async function(message, prefix, command, args, text){
        if (!args[0]) return

        try {
            const code = message.content.slice(prefix.length + command.length + 1)
            const exec = async () => await eval(await exit(code))
            let msg = await message.channel.send(`**\`SUCCESS\`**\n\`\`\`js\n${(await exit(await exec())).slice(0,1900)}\`\`\``)
            await msg.react(config.emojis.trash.id)
            const collector = msg.createReactionCollector((reaction, user) => reaction.emoji.id === config.emojis.trash.id && user.id === message.author.id, { time: 2 * 60 * 1000 })
            await collector.on('collect', async (react) => {
                if (react.emoji.id == config.emojis.trash.id) {
                    await msg.delete().catch(() => 0)
                    collector.stop()
                }
            })
            collector.on('end', (collected) => msg.reactions.removeAll().catch(() => 0))
        } catch (err) {
            let emsg = await message.channel.send(`**\`ERROR\`**\n\`\`\`js\n${(await exit(err)).slice(0,1900)}\`\`\``)
            await emsg.react(config.emojis.trash.id)
            const collector = emsg.createReactionCollector((reaction, user) => reaction.emoji.id === config.emojis.trash.id && user.id === message.author.id, { time: 2 * 60 * 1000 })
            await collector.on('collect', async (react) => {
                if (react.emoji.id == config.emojis.trash.id) {
                    await emsg.delete().catch(() => 0)
                    collector.stop()
                }
            })
            collector.on('end', (collected) => emsg.reactions.removeAll().catch(() => 0))
        }
    },
    config: { name: "eval", aliases: ["e"], help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: true } },
    path: null
}