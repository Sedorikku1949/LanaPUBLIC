const { readdirSync } = require("fs")
const Discord = require("discord.js")

function getArgs(message, prefix) {
  if (!prefix || typeof prefix !== "string" || !message || !(message instanceof Discord.Message)) return { prefix: null, command: null, args: null }
  const content = message.content.trim().toLowerCase();
  return { prefix: content.slice(0, prefix.length), command: content.slice(prefix.length).trim().split(/\s+/g)[0], args: content.slice(prefix.length).trim().split(/\s+/g).slice(1) };
}

async function isStaff(message) {
  if ( Array.isArray((await database.db.get("guild/"+message.guild.id))?._config?.staffRoles) && (await database.db.get("guild/"+message.guild.id))?._config?.staffRoles.length > 0 ) {
    if ( (await database.db.get("guild/"+message.guild.id))._config.staffRoles.some(r => message.member.roles.cache.has(r)) ) return false;
    else return true;
  }
  else {
    if (message.member.permissions.has("MANAGE_MESSAGES")) return false;
    return true;
  };
};

async function getPrefix(message){
  return new Promise(async function(resolve,_){
    if (await database.db.has("guild/"+message.guild.id)){
      // guild exist in database
      const data = (await database.db.get("guild/"+message.guild.id))?.prefix
      if (data) resolve(data);
      else resolve(client.prefix);
    } else resolve(client.prefix);
  })
};

module.exports = {
  init: function(){
    const cmd = [];
    let error = [];
    function searchAllFiles(path) {
      readdirSync(path).forEach( (dir) => {
        if (!dir.match(/\./g)) searchAllFiles(`${path}/${dir}`); // dossier
        if (dir.match(/\.json/g) || !dir.match(/\.js/g) || path.match(/sub/g) || !dir.endsWith(".js")) return; // other file
        if (dir.match(/\.js/g) && dir.endsWith(".js")) {
          try { const c = require(`../../${path}/${dir}`); if (!c.exe || !c.config) throw new Error("exe or config Object/function is needed for the commande"); c.path = `${path}/${dir}`; c.lang = `this.commands["${c.config.name}"]` ; cmd.push(c); deleteCache(require.resolve(`../../${path}/${dir}`)); }
            catch(err) { console.log(`{red}{ ERROR }  >>  An error as occured when loading the command "${dir}" at the path "${path}/${dir}"`); error.push({ error: err, path: `${path}/${dir}`, file: dir}); };
        }; // js file
      });
    };
    searchAllFiles("exe/cmd")
    if (error.length > 0) console.log(`{red}Some error has occured when loading commands :\n\n${require("util").inspect(error)}`)
    console.log(`{green}${cmd.length} commands has been loaded successfully{stop}\n{cyan}{bold}${cmd.length} commands has been removed from the cache !`)
    return cmd
  },
  execute: async function(message){
    if (!(message instanceof Discord.Message) || !message.guild || !message.author || typeof message.guild.id !== "string") return;
    const PREFIX = await getPrefix(message);
    const { prefix, command, args } = getArgs(message, PREFIX);
    if (!prefix || !command || prefix !== PREFIX) return;
    const lang = clone(await database.db.get("user/"+message.author.id) ? (database.language[await database.db.get("user/"+message.author.id).lang] || database.language.fr) : database.language.fr );

    const cmd = database.commands.find((cmd) => cmd.config.name == command || (cmd.config.aliases.length > 0 && cmd.config.aliases.includes(command)));
    if (!cmd) return;

    if (cmd.config.system.staffCommand && await isStaff(message)) return message.channel.send(lang.misc.handler.noStaff);
    if (cmd.config.system.devCommand && !config.dev.devID.includes(message.author.id)) return message.channel.send(lang.misc.handler.noDev);
    if ((await database.db.get("guild/"+message.guild.id)) && (await database.db.get("guild/"+message.guild.id))?.config?.ignoreChannel && (await database.db.get("guild/"+message.guild.id))["_config"].ignoreChannel.includes(message.channel.id)) return;
    if ((await database.db.get("guild/"+message.guild.id)) && (await database.db.get("guild/"+message.guild.id))?.config?.ignoreCategory && (await database.db.get("guild/"+message.guild.id))["_config"].ignoreCategory.includes(message.channel.id)) return;
    if ((await database.db.get("guild/"+message.guild.id)) && (await database.db.get("guild/"+message.guild.id))?.config?.ignoreCommand && (await database.db.get("guild/"+message.guild.id))["_config"].ignoreCommand.includes(message.channel.id)) return;
    if ((await database.db.get("guild/"+message.guild.id)) && (await database.db.get("guild/"+message.guild.id))?.config?.ignoreUser && (await database.db.get("guild/"+message.guild.id))["_config"].ignoreUser.includes(message.channel.id)) return;

    try { cmd.exe(message, prefix, command, args, lang.commands[cmd.config.name] ); console.log(`{ COMMAND EXECUTOR } {yellow}< ${getDate(Date.now(), `[DD]/[MM]/[YYYY] à [hh]:[mm] et [ss]:[ms]`)} | ${Date.now()} >{stop} command "${cmd.config.name}" executed by {cyan}${message.author.tag} / ${message.author.id}{stop} in {blue}( #${message.channel.name} | ${message.channel.id} ){stop}`); await database.db.inc("user/"+message.author.id, "score") }
      catch(err) {
        message.channel.send(lang.misc.handler.error)
        client.channels.cache.get(config.dev.errorChannel).send({ embed: { color: "#ED4245", fields: [{name: "Path :", value: "```\n"+cmd.path+"```"}, {name: "Executor :", value: "```\n"+message.author.tag+" / "+message.author.id+"```"}, {name: "Guild :", value: "```\n"+message.guild.name+" / "+message.guild.id+"```"}], title: "Une erreur est survenue !", description: "```js\n"+require("util").inspect(err).slice(0,1900).replace("`", "`\u200b")+"```" } })
      }
  }
}