const { getDate } = Utils;

module.exports = {
  exe: async function(message, prefix, command, args, lang){
      let user = await message.guild.members.selectMember((message.content.slice(prefix.length+command.length+1) || message.author.id), { bot: true, fetch: true });
      if (args[0] && !user) return message.channel.send(lang.assets.noUserFound)
      message.reply({ embeds: [{
        color: message.guild.colors("embed"),
        author: { name: user.user?.tag ?? user.tag, icon_url: user.displayAvatarURL({ size: 2048, format: "png", dynamic: true }) },
        description: message.guild.translate(lang+"assets.FIRST_STP", (user.user?.tag ?? user.tag), user.id) + (user.user ?
          message.guild.translate(lang+"assets.MEMBER", getDate(user.user.createdTimestamp, `[DD]/[MM]/[YYYY] a [hh]:[mm]`), Math.trunc(user.user.createdTimestamp/1000), getDate(user.joinedTimestamp, `[DD]/[MM]/[YYYY] à [hh]:[mm]`), Math.trunc(user.joinedTimestamp/1000))
          : message.guild.translate(lang+"USER", getDate(user.user.createdTimestamp, `[DD]/[MM]/[YYYY] a [hh]:[mm]`), Math.trunc(user.user.createdTimestamp/1000)))
          + message.guild.translate(lang+"assets.AVATAR", user.user?.displayAvatarURL({size:2048,dynamic:true,format:"png"}) ?? user.displayAvatarURL({size:2048,dynamic:true,format:"png"}))
      }] }).catch(() => false);
  },
  config: { name: "userinfo", aliases: ["ui"], category: "info", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}