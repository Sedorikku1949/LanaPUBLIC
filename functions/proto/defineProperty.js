const Discord = require('discord.js');

module.exports = async function(){
  Object.defineProperty(Discord.GuildMember, "isStaff", {
    get: function() {
      return database.db.get(`guild/${this.guild.id}`, "['_config'].staffRoles").length > 0
        ? database.db
          .get(`guild/${this.id}`, "['_config'].staffRoles")
          .some(r => this.roles.cache.has(r))
        : this.permissions.has("MANAGE_MESSAGES");
    }
  })
}