module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(lang.assets.noArgs)
      let role = await message.guild.roles.selectRole(message.content.slice(prefix.length+command.length+1));
      if (args[0] && !role) return message.reply(lang.assets.noRole)
      await message.guild.members.fetch();
      lang.assets.response.embeds[0].title = lang.assets.response.embeds[0].title.replace(/{roleName}/g, role.name);
      lang.assets.response.embeds[0].fields[0].value = lang.assets.response.embeds[0].fields[0].value.replace(/{roleName}/g, role.name);
      lang.assets.response.embeds[0].fields[1].value = lang.assets.response.embeds[0].fields[1].value.replace(/{roleID}/g, role.id);
      lang.assets.response.embeds[0].fields[2].value = lang.assets.response.embeds[0].fields[2].value.replace(/{roleCreation}/g, getDate(role.createdTimestamp, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)).replace(/{creationDuration}/g, Math.trunc(role.createdTimestamp/1000));
      lang.assets.response.embeds[0].fields[3].value = lang.assets.response.embeds[0].fields[3].value.replace(/{memberWithRole}/g, message.guild.members.cache.filter(e => e.roles.cache.has(role.id)).size);
      lang.assets.response.embeds[0].fields[4].value = lang.assets.response.embeds[0].fields[4].value.replace(/{permission}/g, require("util").inspect(role.permissions.bitfield));
      lang.assets.response.embeds[0].fields[5].value = lang.assets.response.embeds[0].fields[5].value.replace(/{hoist}/g, role.hoist ? "🟢":"🔴").replace(/{mention}/g, role.mentionable?"🟢":"🔴").replace(/{color}/g, role.hexColor);
      message.reply(lang.assets.response)
  },
  config: { name: "roleinfo", aliases: ["ri"], category: "info", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}