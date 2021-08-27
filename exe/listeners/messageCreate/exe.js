module.exports = async function(message){
  if (["DM", "GROUP_DM"].includes(message.channel.type)  || message.author.bot || !message.content) return;
  await database.db.ensure("blacklist", []);
  require("../../managers/commandsManager").execute(message);
  deleteCache(require.resolve("../../managers/commandsManager"));

  require("../../managers/automod.js")(message);
  deleteCache(require.resolve("../../managers/automod.js"));

  let data = clone(config.bdd.users);
  data.id = message.author.id;
  database.db.ensure("user/"+message.author.id, data);
  badgesChecker(message);

  // xp
  if ((await database.db.get("guild/"+message.guild.id))?._config?.xp) {
    // the xp is enable
    require("../../managers/xpManager.js")(message, false);
    deleteCache(require.resolve("../../managers/xpManager.js"))
  }
}