async function getPrefix(message){
  return new Promise(async function(resolve,_){
    if (await database.db.has("guild/"+message.guild.id)){
      // guild exist in database
      const data = await database.db.get("guild/"+message.guild.id).prefix;
      if (data) resolve(data);
      else resolve(client.prefix);
    } else resolve(client.prefix);
  })
};

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply(lang.assets.notAdmin);
    if (!(await database.db.get("guild/"+message.guild.id))) return message.reply(lang.assets.databaseError);
    if (await database.db.get("guild/"+message.guild.id, '["_config"].enable')) return message.reply(lang.assets.alreadyEnable);
    await database.db.set("guild/"+message.guild.id, true, "['_config'].enable");
    message.reply(lang.assets.enable);
    if ( !message.channel.permissionsFor(client.user.id).toArray().includes("ADMINISTRATOR") ) message.reply(lang.assets.noGoodPermission);
  },
  config: { name: "enable", aliases: [], category: "config", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
  path: null
}