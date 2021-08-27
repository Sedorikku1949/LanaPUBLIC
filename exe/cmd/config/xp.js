module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(lang.assets.noArgs);
    const guildData = await database.db.get("guild/"+message.guild.id)
    switch(args[0]) {
      case "msg": {
        break;
      };
      case "add": {
        break;
      };
      case "remove": {
        break;
      };
      case "on": {
        await database.db.set("guild/"+message.guild.id, guildData["_config"].xp ? false : true, '["_config"].xp');
        message.reply(guildData["_config"].xp ? lang.assets.on.disable : lang.assets.on.active).catch(() => false);
        break;
      };
      case "test": {
        await message.react("✅").catch(() => false);
        require("../../managers/xpManager.js")(message, true);
        deleteCache(require.resolve("../../managers/xpManager.js"));
        break;
      };
      case "nochannel": {
        break;
      };
      case "norole": {
        break;
      };
      case "nouser": {
        break;
      };
      default: message.reply(lang.assets.invalidArgs);
    }
  },
  config: { name: "xp", aliases: [], category: "config", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
  path: null
}