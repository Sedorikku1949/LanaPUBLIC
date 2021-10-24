const Discord = require("discord.js")

module.exports = class slashCommands {
  /**
   * Charge les commands slash
   */
  static loadAll = async function(){
    const availableCommands = database.commands.filter(e => typeof e.interaction == "function")
    // chargement avec 1h de délais
    availableCommands.forEach( async function(cmd){
      try {
        await client.applications?.commands.create({
          name: cmd.config.name.toLowerCase(),
          description: database.language.fr.commands[cmd.config.name]?.desc ?? "..."
        }).catch(() => false);
      } catch(err) {
        console.log(`{red}An error as occured when loading the slash commands "${cmd.config.name}"`);
        console.log(err);
      };
    });
  };
  static loadGuild = async function(guild) {
    return new Promise(async(resolve,_) => {
      if ( !(guild instanceof Discord.Guild) || !guild.id ) throw new Error("The argument must be a guild !")
      const availableCommands = database.commands.filter(e => typeof e.interaction == "function")
      // changement instantanée
      availableCommands.forEach( async function(cmd){
        try {
          await guild.commands.create({
            name: cmd.config.name.toLowerCase(),
            description: database.language.fr.commands[cmd.config.name]?.desc || "DESC_ERROR",
          }).catch(() => false);
        } catch(err) {
        };
      });
      resolve(true);
    })
  };
  static deleteCommand = async function(guild, id){
    const availableCommands = database.commands.filter(e => typeof e.interaction == "function")
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