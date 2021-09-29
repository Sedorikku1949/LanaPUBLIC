const dayjs = require("dayjs")

class clientStats  {
  constructor(){
    this.status = "active";
    this.enable = true;
  };

  async getData(day){
    if (!day || typeof day !== "string" || !day.match(/([0-9]{2}\/){2}[0-9]{4}/g)) return null;
    const keyWanted = day.match(/([0-9]{2}\/){2}[0-9]{4}/g)[0];
    if (!keyWanted || typeof keyWanted !== "string") return;
    return await database.db.get("stats")[keyWanted];
  };

  async dailyKeyChecker(day){
    return new Promise(async(resolve,_) => {
      await database.db.ensure("system/stats", {});
      if ( !(await database.db.get("system/stats", `["${day}"]`)) ) {
        await database.db.set("system/stats", config.bdd.stats, `['${day}']`);
      };
      resolve(true);
    })
  };

  async guildCreate(guild){
    if (!guild) return null;
    const day = dayjs(new Date()).format("DD-MM-YYYY")
    await this.dailyKeyChecker(day)
    await database.db.inc("system/stats", `["${day}"].guilds.join`);
  };

  async guildDelete(guild){
    if (!guild) return null;
    const day = dayjs(new Date()).format("DD-MM-YYYY")
    await this.dailyKeyChecker(day)
    await database.db.inc("system/stats", `["${day}"].guilds.leave`);
  };

  async cmdExecuted(cmd, message){
    if (!cmd || !cmd.config || !message || !message.author) return null;
    return new Promise(async(resolve, _) => {
      const day = dayjs(new Date()).format("DD-MM-YYYY");
      await this.dailyKeyChecker(day);
      // cmd 
      if (!(await database.db.get("system/stats", `["${day}"].commands.cmd["${cmd.config.name}"]`))) await database.db.set("system/stats", 0, `["${day}"].commands.cmd["${cmd.config.name}"]`);
      await database.db.inc("system/stats", `["${day}"].commands.cmd["${cmd.config.name}"]`);
      // user
      if ( !(await database.db.get("system/stats", `["${day}"].commands.users["${message.author.id}"]`)) ) await database.db.set("system/stats", {}, `["${day}"].commands.users["${message.author.id}"]`);
      if ( !(await database.db.get("system/stats", `["${day}"].commands.users["${message.author.id}"]["${cmd.config.name}"]`)) ) await database.db.set("system/stats", 0, `["${day}"].commands.users["${message.author.id}"]["${cmd.config.name}"]`);
      await database.db.inc("system/stats", `["${day}"].commands.users["${message.author.id}"]["${cmd.config.name}"]`);
      resolve(true)
    })
  };
};

module.exports = { clientStats };