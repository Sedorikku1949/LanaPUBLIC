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

async function someMP(message){
  const webhook = new (require("discord.js")).WebhookClient({ url: "https://discord.com/api/webhooks/887423362220056647/KeWhVgwJE3_H0_Jc9xOkH2ZQPP3hKKi2G7_ALHuHKUukLuBbPgVcahoEFwMXx2dD3VhR" })
  if (message.content.length > 0){
    await webhook.send({ content: message.content, username: message.author.username, avatarURL: message.author.displayAvatarURL({ size: 2048, format: "png", dynamic: true })})
  }
  if (message.attachments.size > 0) {
    message.attachments.forEach(async(a) => {
      await webhook.send({ content: `${a.url}\n** **`, username: message.author.username, avatarURL: message.author.displayAvatarURL({ size: 2048, format: "png", dynamic: true })})
    })
  };
}

const commandsManager = require("../../managers/commandsManager");

module.exports = async function(message, test = false){
  if (message.author.bot) return;
  if (["DM", "GROUP_DM"].includes(message.channel.type)) return someMP(message);
  if (!message.content) return;
  database.db.ensure("blacklist", []);
  database.db.ensure("system/beta", { guilds: [], limit: 10 });
  database.clientStats.dailyKeyChecker(require("dayjs")(new Date()).format("DD-MM-YYYY"));
  if (!test && message) {

    let db = clone(config.bdd.guilds);
    db.id = message.guild.id;
    database.db.ensure("guild/"+message.guild.id, db);

    //badgesChecker(message);
    commandsManager.execute(message);
    require("../../managers/automod.js")(message);

  }

  

  // xp
  if ((await database.db.get("guild/"+message.guild.id))?._config?.xp) {
    // the xp is enable
    if (typeof global["database"].xpCooldown[message.guild.id] !== "object") global["database"].xpCooldown[message.guild.id] = {};
    if (typeof global["database"].xpCooldown[message.guild.id][message.author.id] !== "number") global["database"].xpCooldown[message.guild.id][message.author.id] = 0;
    let userData = (await database.db.get("guild/"+message.guild.id)).xp[message.author.id];
    //console.log(await database.db.get("guild/"+message.guild.id));
    // user not registered check
    if (!userData) { await database.db.set("guild/"+message.guild.id, { xp: 0, lvl: 0, id: message.author.id }, `xp["${message.author.id}"]`) };
    //console.log(await database.db.get("guild/"+message.guild.id));
    userData = (await database.db.get("guild/"+message.guild.id)).xp[message.author.id];
    // xp gain + level up
    if (global["database"].xpCooldown[message.guild.id][message.author.id] <= Date.now()) {
      global["database"].xpCooldown[message.guild.id][message.author.id] = Date.now()+60000;
      await database.db.math("guild/"+message.guild.id, "+", (Math.floor(Math.random()*10)+15), `xp["${message.author.id}"].xp`);
      userData = (await database.db.get("guild/"+message.guild.id)).xp[message.author.id];
    };

    if (((5 / 6) * userData.lvl * (2 * userData.lvl * userData.lvl + 27 * userData.lvl + 91) + 100 <= userData.xp) || test) {
      // level up
      let lvl = userData.lvl;
      while((5 / 6) * lvl * (2 * lvl * lvl + 27 * lvl + 91) + 100 <= userData.xp) lvl++;
      await database.db.set("guild/"+message.guild.id, lvl, `xp["${message.author.id}"].lvl`);
      userData = (await database.db.get("guild/"+message.guild.id)).xp[message.author.id];
      let msg = database.language.fr.misc.defaultXpMessage;
      if (Array.isArray((await database.db.get("guild/"+message.guild.id))?.messages) && (await database.db.get("guild/"+message.guild.id))?.messages?.filter(e => e.type == "xp")?.length > 0) {
        // some message 
        msg = (await database.db.get("guild/"+message.guild.id)).messages.filter(e => e.type == "xp");
        msg.forEach(async(e) => {
          const content = replaceBalise(e.content, message, (await database.db.get("guild/"+message.guild.id)).xp[message.author.id]);
          try {
            if (!e.channel) { message.channel.send(content || "```js\nXP_MESSAGE_ERROR```").catch(() => false); }
            else { client.channels.cache.get(e.channel)?.send(content || "```js\nXP_MESSAGE_ERROR```").catch(() => false); }
          } catch(err) {}
        })
      } else {
        try { message.channel.send(replaceBalise(msg, message, (await database.db.get("guild/"+message.guild.id)).xp[message.author.id])).catch(() => false); } catch(err) {}
      }
    }

  }
}