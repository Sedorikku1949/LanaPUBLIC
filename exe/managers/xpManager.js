const xpCooldown = {};

function replaceBalise(str, message, data){
  return str.replace(/\{(userTag|username|mention|lvl|xp|channelName|channelMention)\}/g, (a,_) => {
      switch(a){
          case "{userTag}": return message.author.tag;
          case "{username}": return message.author.username;
          case "{mention}": return message.author.toString();
          case "{channelName}": return message.channel.name;
          case "{channelMention}": return message.channel.toString();
          case "{lvl}": return (typeof data == "object" && !Array.isArray(data) ? (data.lvl || "0") : "0" );
          case "{xp}": return (typeof data == "object" && !Array.isArray(data) ? (data.xp || "0") : "0" );
          default: return a;
      }
  })
}

module.exports = async function(message, test = false){
  if (!xpCooldown[message.author.id]) xpCooldown[message.author.id] = 0;
  let userData = (await database.db.get("guild/"+message.guild.id)).xp[message.author.id];
  //console.log(await database.db.get("guild/"+message.guild.id));
  // user not registered check
  if (!userData) { await database.db.set("guild/"+message.guild.id, { xp: 0, lvl: 0, id: message.author.id }, `xp["${message.author.id}"]`) };
  //console.log(await database.db.get("guild/"+message.guild.id));
  userData = (await database.db.get("guild/"+message.guild.id)).xp[message.author.id];
  // xp gain + level up
  if (xpCooldown[message.author.id] <= Date.now()) { xpCooldown[message.author.id] = Date.now()+60000 ;await database.db.math("guild/"+message.guild.id, "+", (Math.floor(Math.random()*10)+15), `xp["${message.author.id}"].xp`) };
  if (((5 / 6) * userData.lvl * (2 * userData.lvl * userData.lvl + 27 * userData.lvl + 91) + 100 <= userData.xp) || test) {
    // level up
    let lvl = userData.lvl;
    while((5 / 6) * lvl * (2 * lvl * lvl + 27 * lvl + 91) + 100 <= userData.xp) lvl++;
    await database.db.set("guild/"+message.guild.id, lvl, `xp["${message.author.id}"].lvl`);
    userData = (await database.db.get("guild/"+message.guild.id)).xp[message.author.id];
    let msg = database.language.fr.misc.defaultXpMessage;
    if ((await database.db.get("guild/"+message.guild.id)).messages?.filter(e => e.type == "xp")) {
      // some message 
      msg = (await database.db.get("guild/"+message.guild.id)).messages.filter(e => e.type == "xp");
      msg.forEach(async(e) => {
        const content = replaceBalise(e.content, message, (await database.db.get("guild/"+message.guild.id)).xp[message.author.id]);
        if (!e.channel) { message.channel.send(content || "```js\nXP_MESSAGE_ERROR```").catch(() => false); }
        else { client.channels.cache.get(e.channel)?.send(content || "```js\nXP_MESSAGE_ERROR```").catch(() => false); }
      })
    } else {
        message.channel.send(replaceBalise(msg, message, (await database.db.get("guild/"+message.guild.id)).xp[message.author.id])).catch(() => false);
    }
  }
}