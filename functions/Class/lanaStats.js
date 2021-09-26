const dayjs = require("dayjs");

class lanaStats {
  constructor(){
    database.db.ensure("system/stats", {})
  }

  async commandUse(cmd){
    const obj = {
      name: cmd.config.name,
      timestamp: Date.now()
    };
    database.db.inc("system/stats", `["${daysj(new Date()).format("DD/MM/YYYY")}"].cmd["${cmd.config.name}"].score`);
    database.db.push("system/stats", obj, `["${daysj(new Date()).format("DD/MM/YYYY")}"].cmd["${cmd.config.name}"].data`);
  }
};

module.exports = lanaStats;