module.exports = {
  exe: async function(message, prefix, command, args, lang){
    lang.assets.embeds[0].author.icon_url = client.user.displayAvatarURL({ size: 2048, format: "png", dynamic: true });
    lang.assets.embeds[0].author.name = lang.assets.embeds[0].author.name.replace(/{name}/g, client.user.tag);
    lang.assets.embeds[0].fields[0].value = lang.assets.embeds[0].fields[0].value.replace(/{dev}/, config.dev.devID.map(e => `<@${e}>`).join("\n"));
    lang.assets.embeds[0].fields[3].value = lang.assets.embeds[0].fields[3].value.replace(/{server}/, client.guilds.cache.size).replace(/{users}/, client.users.cache.size).replace(/{uptime}/, getDate(client.readyTimestamp, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)).replace(/{uptimeDuration}/, Math.trunc(client.readyTimestamp/1000)).replace(/{date}/, getDate(client.user.createdTimestamp, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)).replace(/{dateDuration}/, Math.trunc(client.user.createdTimestamp/1000));
    lang.assets.embeds[0].fields[4].value = lang.assets.embeds[0].fields[4].value.replace(/{node}/, process.version).replace(/{djs}/, require("discord.js").version);
    message.reply(lang.assets);
  },
  config: { name: "bot", aliases: ["lana"], category: "info", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}