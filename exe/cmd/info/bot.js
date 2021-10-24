const dayjs = require("dayjs");
dayjs.locale("fr")

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    switch(args[0]){
      case "icon": {
        message.reply({ embeds: [{ color: message.guild.colors("embed"), image: { url: client.user.displayAvatarURL({ size: 2048, format: "png" }) } }] });
        break;
      };
      case "system": {
        message.reply({ embeds: [{
          color: message.guild.colors("embed"),
          author: { icon_url: client.user.displayAvatarURL({ size: 2048, format: "png" }), name: client.user.tag },
          title: message.guild.translate(lang+"assets.SYSTEM_TITLE"),
          description: message.guild.translate(lang+"assets.SYSTEM_DESC", process.platform, process.version, require("../../../package.json").dependencies.npm.replace(/\^/g, ""))
        }] })
        break;
      };
      case "other": {
        message.reply({ embeds: [{
          color: message.guild.colors("embed"),
          author: { icon_url: client.user.displayAvatarURL({ size: 2048, format: "png" }), name: client.user.tag },
          title: message.guild.translate(lang+"assets.OTHER_TITLE"),
          description: message.guild.translate(
            lang+"assets.OTHER_DESC",
            client.guilds.cache.size,
            client.guilds.cache.filter(e => e.memberCount >= 1000).size || '0',
            client.guilds.cache.filter(e => e.memberCount >= 200).size || "0",
            Number(database.db.get("system/stats", `["${dayjs(new Date()).format("DD-MM-YYYY")}"]`)?.guilds?.join || 0) - Number(database.db.get("system/stats", `["${dayjs(new Date()).format("DD-MM-YYYY")}"]`)?.guilds?.leave || 0),
            client.users.cache.size,
            client.guilds.cache.filter(e => database.db.get("system/beta").guilds.includes(e.id)).reduce((a,b) => a += b.memberCount, 0),
            client.guilds.cache.reduce((a,b) => a += b.roles.cache.size, 0),
            client.channels.cache.filter(chl => chl.type == "GUILD_CATEGORY").size,
            client.channels.cache.filter(chl => chl.type == "GUILD_TEXT").size,
            client.channels.cache.filter(chl => chl.type == "GUILD_VOICE").size,
            client.channels.cache.filter(chl => chl.type.match(/GUILD_([A-Z]+)_THREAD/g)).size
          )
        }] })
        break;
      };
      default: {
        message.reply({ embeds: [{
          color: message.guild.colors("embed"),
          author: { icon_url: client.user.displayAvatarURL({ size: 2048, format: "png" }), name: client.user.tag },
          fields: [
            { name: message.guild.translate(lang+"assets.DEV_NAME"), value: message.guild.translate(lang+"assets.DEV", config.dev.devID.map(e => client.users.cache.get(e)?.tag ?? e).join("\n")), inline: true },
            { name: message.guild.translate(lang+"assets.HEBERG_NAME"), value: message.guild.translate(lang+"assets.HEBERG"), inline: true },
            { name: message.guild.translate(lang+"assets.DESIGN_NAME"), value: message.guild.translate(lang+"assets.DESIGN"), inline: true },
            { name: message.guild.translate(lang+"assets.STATS_NAME"), value: message.guild.translate(lang+"assets.STATS", client.guilds.cache.size, client.guilds.cache.reduce((a,b)=>a+=b.memberCount,0), dayjs(client.readyTimestamp).format("DD/MM/YYYY à HH:MM"), Math.trunc(client.readyTimestamp/1000), dayjs(client.user.createdTimestamp).format("DD/MM/YYYY à HH:MM"), Math.trunc(client.user.createdTimestamp/1000)), inline: false },
            { name: message.guild.translate(lang+"assets.LIB_NAME"), value: message.guild.translate(lang+"assets.LIB", process.version, require("discord.js").version, require("../../../package.json").dependencies["brain.js"].replace(/\^/g, ""), require("../../../package.json").devDependencies.typescript.replace(/\^/g, "")), inline: false },
            { name: message.guild.translate(lang+"assets.DATABASE_NAME"), value: message.guild.translate(lang+"assets.DATABASE", require("../../../package.json").dependencies.ravendb.replace(/\^/g, "")), inline: false },
          ]
        }] })
        break;
      }
    }
  },
  config: { name: "bot", aliases: ["lana"], category: "info", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}