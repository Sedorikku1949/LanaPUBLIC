module.exports = {
  exe: async function(message, prefix, command, args, lang){
      let user = await message.guild.members.selectMember((message.content.slice(prefix.length+command.length+1) || message.author.id), { bot: true, fetch: true });
      if (args[0] && !user) return message.channel.send(lang.assets.noUserFound)
      if (user.user) {
        // member
        const embed = JSON.parse(JSON.stringify(lang.assets.member));
        embed.embeds[0].author.name = embed.embeds[0].author.name.replace(/{name}/, user.user.tag);
        embed.embeds[0].author.icon_url = embed.embeds[0].author.icon_url.replace(/{url}/, user.user.displayAvatarURL({ dynamic: true }));
        embed.embeds[0].description = embed.embeds[0].description.replace(/{tag}/, user.user.tag.replace(/`/g, "`\u200b")).replace(/{id}/, user.id).replace(/{calender}/, emojis.calender.msg).replace(/{creationDate}/, getDate(user.user.createdTimestamp, `[DD]/[MM]/[YYYY] a [hh]:[mm]`)).replace(/{userDuration}/, Math.trunc(user.user.createdTimestamp/1000)).replace(/{emojisPlus}/, emojis.plus.msg).replace(/{memberDate}/, getDate(user.joinedTimestamp, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)).replace(/{memberDuration}/, Math.trunc(user.joinedTimestamp/1000)).replace(/{avatar}/, user.user.displayAvatarURL({size:2048,dynamic:true,format:"png"}))
        message.reply(embed)
      } else {
        // user
        const embed = JSON.parse(JSON.stringify(lang.assets.user));
        embed.embeds[0].author.name = embed.embeds[0].author.name.replace(/{name}/, user.tag); 
        embed.embeds[0].author.icon_url = embed.embeds[0].author.icon_url.replace(/{url}/, user.displayAvatarURL({ dynamic: true }));
        embed.embeds[0].description = embed.embeds[0].description.replace(/{tag}/, user.tag.replace(/`/g, " ")).replace(/{id}/, user.id).replace(/{calender}/, emojis.calender.msg).replace(/{creationDate}/, getDate(user.createdTimestamp, `[DD]/[MM]/[YYYY] a [hh]:[mm]`)).replace(/{userDuration}/, Math.trunc(user.createdTimestamp/1000)).replace(/{emojisPlus}/, emojis.plus.msg).replace(/{avatar}/, user.displayAvatarURL({size:2048,dynamic:true,format:"png"}))
        message.reply(embed)
      }
  },
  config: { name: "userinfo", aliases: ["ui"], category: "info", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}