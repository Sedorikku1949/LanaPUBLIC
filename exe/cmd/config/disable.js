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
        if (!(await database.db.get("guild/"+message.guild.id))["_config"].enable) return message.reply(lang.assets.alreadyDisable);
        await database.db.set("guild/"+message.guild.id, false, "['_config'].enable" );
        let embed = JSON.parse(JSON.stringify(lang.assets.disable));
        embed.embeds[0].footer.text = embed.embeds[0].footer.text.replace(/{prefix}/g, await getPrefix(message));
        message.reply(embed);
    },
    config: { name: "disable", aliases: [], category: "config", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: true, devCommand: false } },
    path: null
}