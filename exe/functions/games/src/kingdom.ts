const Discord = require("discord.js");

/**
 * Main class for the game
 * 
 * REQUIRED @param { Discord.User } = user
 * REQUIRED @param { global } = the global object for database
 * 
 * @return {
 *  id: any,
 *  inventory: [],
 *  xp: 0,
 *  lvl: 0,
 * }
 */

class kingdom {
  public readonly id: string = "";
  public inventory: any[] = [];
  public level: number = 0;
  public xp: number = 0;

  constructor(user){
    if (!user || !(user instanceof Discord.User)) throw new Error("User must be a discord.js class !")
    this.id = user?.id;
  };
};


// EXPORT
export const main = kingdom;