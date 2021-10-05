const Discord = require("discord.js");

class kingdom {
  readonly name: string = "hello";
  private token: number = Date.now()**2;

  constructor(user){
    if (!user || !(user instanceof Discord.User)) throw new Error("User must be a discord.js class !")
    this.name = user.username;
  }
};

export default kingdom