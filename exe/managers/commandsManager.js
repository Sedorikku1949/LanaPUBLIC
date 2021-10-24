const { readdirSync } = require("fs")
const Discord = require("discord.js")

function commandsArgs(cmd, message, args) {
  function getArgs(str){};
}

const { clone, getDate } = Utils;

module.exports = {
  init: function(){
    let [cmd, error] = [[], []];
    function searchAllFiles(path) {
      readdirSync(path).forEach( (dir) => {
        if (!dir.match(/\./g)) searchAllFiles(`${path}/${dir}`); // dossier
        if (dir.match(/\.json/g) || !dir.match(/\.js/g) || path.match(/sub/g) || !dir.endsWith(".js")) return; // other file
        if (dir.match(/\.js/g) && dir.endsWith(".js")) {
          try {
            const c = require(`../../${path}/${dir}`); if (!c.exe || !c.config) throw new Error("exe or config Object/function is needed for the commande");
            c.path = `${path}/${dir}`; c.lang = `#commands["${c.config.name}"]`;
            cmd.push(c); deleteCache(require.resolve(`../../${path}/${dir}`));
          }
            catch(err) { console.log(`{red}{ ERROR }  >>  An error as occured when loading the command "${dir}" at the path "${path}/${dir}"`); error.push({ error: err, path: `${path}/${dir}`, file: dir}); };
        }; // js file
      });
    };
    searchAllFiles("exe/cmd")
    if (error.length > 0) console.log(`{red}Some error has occured when loading commands :\n\n${require("util").inspect(error)}`)
    console.log(`{green}${cmd.length} commands has been loaded successfully{stop}\n{cyan}{bold}${cmd.length} commands has been removed from the cache !`)
    return cmd;
  },
  execute: async function(message){
    if (!(message instanceof Discord.Message) || !message.guild || !message.author || typeof message.guild.id !== "string") return;
    const PREFIX = message.getPrefix();
    const { prefix, command, args } = message.getArgs();
    if (!prefix || !command || prefix !== PREFIX) return;
    const data = await database.db.get("user/"+message.author.id);
    const lang = clone(data ? (database.language[data.lang] || database.language.fr) : database.language.fr );

    const cmd = database.commands.find((cmd) => cmd.config.name == command || (cmd.config.aliases.length > 0 && cmd.config.aliases.includes(command)));
    if (!cmd) return;

    if (database.db.get("blacklist").some(e => e.id == message.author.id)) return message.reply(lang.misc.blacklistedUser);
    if (cmd.config.system.staffCommand && !message.member.isStaff(message)) return message.reply(lang.misc.noStaff);
    if (cmd.config.system.devCommand && !config.dev.devID.includes(message.author.id)) return message.reply(lang.misc.noDev);
    if (message.isIgnored()) return;
    if (Array.isArray(cmd.config.options) && commandsArgs(cmd, message, args)) return require("../functions/other/sendSpecificCommandHelp.js")(null, cmd, message, '#commands["help"]', prefix);

    if (database.commandCooldown[message.author.id] > Date.now()) return message.react("🕜");
    try {
      database.commandCooldown[message.author.id] = Date.now() + 1000;
      console.log(`{ COMMAND EXECUTOR } {yellow}< ${getDate(Date.now(), `[DD]/[MM]/[YYYY] à [hh]:[mm] et [ss]:[ms]`)} | ${Date.now()} >{stop} command "${cmd.config.name}" executed by {cyan}${message.author.tag} / ${message.author.id}{stop} in {blue}( #${message.channel.name} | ${message.channel.id} ){stop}`); await database.db.inc("user/"+message.author.id, "score")
      database.clientStats.cmdExecuted(cmd, message);
      cmd.exe(message, prefix, command, args, (cmd.lang ?? "commands"));
    } catch(err) {
      database.commandCooldown[message.author.id] = Date.now() + 1000;
      console.log(err);
      message.reply(message.guild.translate("ERROR"));
      client.channels.cache.get(config.dev.errorChannel).send({ embeds: [{
        color: "#ED4245",
        fields: [
          {name: "Path :", value: "```\n"+cmd.path+"```"},
          {name: "Executor :", value: "```\n"+message.author.tag+" / "+message.author.id+"```"},
          {name: "Guild :", value: "```\n"+message.guild.name+" / "+message.guild.id+"```"}
        ],
        title: "Une erreur est survenue !",
        description: "```js\n"+require("util").inspect(err).slice(0,1900).replace("`", "`\u200b")+"```" 
      }] });
    }
  }
}