const { getDate } = Utils;

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(message.guild.translate(lang+"assets.NO_ARGS"))
      let role = await message.guild.roles.selectRole(message.content.slice(prefix.length+command.length+1));
      if (args[0] && !role) return message.reply(message.guild.translate(lang+"assets.NO_ROLE"))
      await message.guild.members.fetch();
      const embed = { embeds: [{
        color: message.guild.colors("embed"),
        title: message.guild.translate(lang+"assets.TITLE", role.name),
        fields: [
          { name: message.guild.translate(lang+"assets.NAME_FIELD"), value: role.name, inline: true },
          { name: message.guild.translate(lang+"assets.ID_FIELD"), value: role.id, inline: true },
          { name: message.guild.translate(lang+"assets.CREATED_FIELD"), value: message.guild.translate(lang+"assets.CREATED_FIELD_VALUE", (getDate(role.createdTimestamp, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)), (Math.trunc(role.createdTimestamp/1000)) ), inline: false },
          { name: message.guild.translate(lang+"assets.MEMBERS_FIELD"), value: String(message.guild.members.cache.filter(e => e.roles.cache.has(role.id)).size), inline: false },
          { name: message.guild.translate(lang+"assets.PERMS_FIELD"), value: message.guild.translate(lang+"assets.PERMS_FIELD_VALUE", require("util").inspect(role.permissions.bitfield)), inline: false },
          { name: message.guild.translate(lang+"assets.OTHER_FIELD"), value: message.guild.translate(lang+"assets.OTHER_FIELD_VALUE", (role.hoist ? "🟢":"🔴"), (role.mentionable?"🟢":"🔴"), role.hexColor), inline: false },
        ]
      }] };
      message.reply(embed);
  },
  config: { name: "roleinfo", aliases: ["ri"], category: "info", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}