const { readdirSync } = require("fs")
const Discord = require("discord.js")

function getArgs(message, prefix) {
    if (!prefix || typeof prefix !== "string" || !message || !(message instanceof Discord.Message)) return { prefix: null, command: null, args: null }
    const content = message.content.trim().toLowerCase();
    return { prefix: content.slice(0, prefix.length), command: content.slice(prefix.length).trim().split(/\s+/g)[0], args: content.slice(prefix.length).trim().split(/\s+/g).slice(1) };
}

function isStaff(message) {
    if (guilds.get(message.guild.id) && guilds.get(message.guild.id)["_config"] && guilds.get(message.guild.id)["_config"].staffRoles && Array.isArray(guilds.get(message.guild.id)["_config"].staffRoles) && guilds.get(message.guild.id)["_config"].staffRoles.length > 0 ) {
        if ( guilds.get(message.guild.id)["_config"].staffRoles.some(r => message.member.roles.cache.has(r)) ) return false
        else return true
    }
    else {
        if (message.member.permissions.has("MANAGE_MESSAGES")) return false
        else return true
    }
};

module.exports = {
    init: function(){
        const cmd = []
        let error = []
        function searchAllFiles(path) {
            readdirSync(path).forEach( (dir) => {
                if (!dir.match(/\./g)) searchAllFiles(`${path}/${dir}`); // dossier
                if (dir.match(/\.json/g) || !dir.match(/\.js/g) || dir.match(/sub/g) || !dir.endsWith(".js")) return; // other file
                if (dir.match(/\.js/g) && dir.endsWith(".js")) {
                    try { const c = require(`../../${path}/${dir}`); if (!c.exe || !c.config) throw new Error("exe or config Object/function is needed for the commande"); c.path = `${path}/${dir}`; cmd.push(c); deleteCache(require.resolve(`../../${path}/${dir}`)) }
                        catch(err) { console.log(`{red}{ ERROR }  >>  An error as occured when loading the command "${dir}" at the path "${path}/${dir}"`); error.push({ error: err, path: `${path}/${dir}`, file: dir}) }
                }; // js file
            })
        };
        searchAllFiles("exe/cmd")
        if (error.length > 0) console.log(`{red}Some error has occured when loading commands :\n\n${require("util").inspect(error)}`)
        console.log(`{green}${cmd.length} commands has been loaded successfully{stop}\n{cyan}{bold}${cmd.length} commands has been removed from the cache !`)
        return cmd
    },
    execute: function(message){
        if (!(message instanceof Discord.Message)) return;
        const PREFIX = guilds.get(message.guild.id) ? guilds.get(message.guild.id).prefix : client.prefix;
        const { prefix, command, args } = getArgs(message, PREFIX);
        if (!prefix || !command || prefix !== PREFIX) return;
        const lang = (users.get(message.author.id) ? users.get(message.author.id).lang : global["language"].fr)

        const cmd = commands.find((cmd) => cmd.config.name == command || (cmd.config.aliases.length > 0 && cmd.config.aliases.includes(command)));
        if (!cmd) return;

        if (cmd.config.system.staffCommand && isStaff(message)) return message.channel.send(lang.handler.noStaff);
        if (cmd.config.system.devCommand && !config.dev.devID.includes(message.author.id)) return message.channel.send(lang.handler.noDev);
        if (guilds.get(message.guild.id) && guilds.get(message.guild.id)["_config"].ignoreChannel && guilds.get(message.guild.id)["_config"].ignoreChannel.includes(message.channel.id)) return;
        if (guilds.get(message.guild.id) && guilds.get(message.guild.id)["_config"].ignoreCategory && guilds.get(message.guild.id)["_config"].ignoreCategory.includes(message.channel.id)) return;
        if (guilds.get(message.guild.id) && guilds.get(message.guild.id)["_config"].ignoreCommand && guilds.get(message.guild.id)["_config"].ignoreCommand.includes(message.channel.id)) return;
        if (guilds.get(message.guild.id) && guilds.get(message.guild.id)["_config"].ignoreUser && guilds.get(message.guild.id)["_config"].ignoreUser.includes(message.channel.id)) return;

        try { cmd.exe(message, prefix, command, args, lang ); }
            catch(err) {
                message.channel.send(lang.handler.error)
                client.channels.cache.get(config.dev.errorChannel).send({ embed: { color: "#ED4245", fields: [{name: "Path :", value: "```\n"+cmd.path+"```"}, {name: "Executor :", value: "```\n"+message.author.tag+" / "+message.author.id+"```"}, {name: "Guild :", value: "```\n"+message.guild.name+" / "+message.guild.id+"```"}], title: "Une erreur est survenue !", description: "```js\n"+require("util").inspect(err).slice(0,1900).replace("`", "`\u200b")+"```" } })
            }
    }
}