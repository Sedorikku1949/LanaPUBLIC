const availableCommands = ["help", "ping", "invite", "support"];
const Discord = require("discord.js")

module.exports = class slashCommands {
  /**
   * Charge les commands slash
   */
  static loadAll = async function(){
    // chargement avec 1h de délais
    database.commands.forEach( async function(cmd){
      if (!availableCommands.includes(cmd.config.name)) return;
      const data = {
        name: cmd.config.name.toLowerCase(),
        description: database.language.fr.commands[cmd.config.name]?.desc
      };
      try {
        await client.applications?.commands.create(data);
      } catch(err) {
        console.log(`{red}An error as occured when loading the slash commands "${cmd.config.name}"`);
      };
    });
  };
  static loadGuild = async function(guild) {
    return new Promise(async(resolve,_) => {
      if ( !(guild instanceof Discord.Guild) || !guild.id ) throw new Error("The argument must be a guild !")
      // changement instantanée
      database.commands.forEach( async function(cmd){
        if (!availableCommands.includes(cmd.config.name)) return;
        const data = {
          name: cmd.config.name.toLowerCase(),
          description: database.language.fr.commands[cmd.config.name]?.desc,
        };
        try {
          await guild.commands.create(data).catch(() => false);
          resolve(true);
        } catch(err) {
          resolve(false);
        };
      });
    })
  };
  static deleteCommand = async function(guild, id){
    return new Promise(async(resolve,_) => {
      if ( !(guild instanceof Discord.Guild) || !guild.id ) throw new Error("The argument must be a guild !")
      // changement instantanée
      database.commands.forEach( async function(cmd){
        if (!availableCommands.includes(cmd.config.name)) return;
        try {
          await guild.commands.delete(id);
          resolve(true);
        } catch(err) {
          resolve(false);
        };
      });
    })
  }
};