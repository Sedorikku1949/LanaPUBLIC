
// database example => similar to ravendb + MiaDB
global["database"] = new Map()

const dayjs = require("dayjs")

// modele de données
const dataModels = {
 guilds: { join: 0, leave: 0, aciveGuilds: { score: 0, guilds: {} } },
 commands: { cmd: {}, users: {} }, music: { music: 0, queueLength: 0 }
};

class clientStats  {
  constructor(client){
    if (!client) return;
    this.status = "active";
  };

  getData(day){
    if (!day || typeof day !== "string" || !day.match(/([0-9]{2}\/){2}[0-9]{4}/g)) return null;
    const keyWanted = day.match(/([0-9]{2}\/){2}[0-9]{4}/g)[0];
    if (!keyWanted || typeof keyWanted !== "string") return;
    return database.get("stats")[keyWanted];
  };

  async dailyKeyChecker(day){
    return new Promise((resolve,_) => {
      if (!database.get("stats")) database.set("stats", {});
      if (!database.get("stats")[day]) {
        const data = database.get("stats");
        data[day] = dataModels;
        database.set("stats", data);
      };
      resolve(true);
    })
  };

  async guildCreate(guild){
    if (!guild) return null;
    const day = dayjs(new Date()).format("DD/MM/YYYY")
    await this.dailyKeyChecker(day)
    const data = database.get("stats");
    data[day].guilds.join++;
    database.set("stats", data);
  };

  async guildDelete(guild){
    if (!guild) return null;
    const day = dayjs(new Date()).format("DD/MM/YYYY")
    await this.dailyKeyChecker(day)
    const data = database.get("stats");
    data[day].guilds.leave++;
    database.set("stats", data);
  };

  async cmdExecuted(cmd, message){
    if (!cmd || !cmd.config || !message || !message.author) return null;
    return new Promise(async(resolve, _) => {
      const day = dayjs(new Date()).format("DD/MM/YYYY")
      const data = database.get("stats");
      // cmd 
      if (!data[day].commands.cmd[cmd.config.name]) data[day].commands.cmd[cmd.config.name] = 0;
      data[day].commands.cmd[cmd.config.name]++
      // user
      if (!data[day].commands.users[message.author.id]) data[day].commands.users  [message.author.id] = {};
      if (!data[day].commands.users[message.author.id][cmd.config.name]) data[day].commands.users [message.author.id][cmd.config.name] = 0;
      data[day].commands.users[message.author.id][cmd.config.name]++
      database.set("stats", data);
      resolve(true)
    })
  };

  async musicPlayed(url){
    if (!url || typeof url !== "string" || !url.match(/(https?:\/\/)(www\.)?([a-zA-Z0-9]|\.|\/|)+\//gm)) return null;
  }
};

module.exports = { clientStats, database, dataModels };
