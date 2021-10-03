module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!database.musicManager.get(message.guild.id)?.nowPlaying) return message.reply(lang.assets.noMusic);
    if (!message.member.voice?.channel || message.guild.members.cache.get(client.user.id)?.voice?.channel?.id !== message.member.voice.channel?.id) return message.reply(lang.assets.nop);
    const music = database.musicManager.get(message.guild.id).queue[0];
    if (!music) return message.reply(lang.assets.noMusic);
    await message.react(emojis.check.id).catch(() => false)
    const info = await database.musicManager.get(message.guild.id).getVideoInfo(music?.url);
    if (!info) return message.reply(lang.assets.noInfo);
    message.reply({
      embeds: [{
        color: "#5865F2",
        title: info.title.slice(0,255),
        url: info.video_url,
        author: { name: info.author.name, icon_url: info.author.thumbnails?.sort((a,b) => b.width - a.width)[0]?.url ?? "https://cdn.discordapp.com/attachments/832164618956832799/888732061828014080/9HZBYcvaOEnh4tOp5EqgcCr_vKH7cjFJwkvw-45Dfjs.png" },
        thumbnail: { url: info.thumbnails?.sort((a,b) => b.width - a.width)[0].url ?? "https://cdn.discordapp.com/attachments/832164618956832799/888732061828014080/9HZBYcvaOEnh4tOp5EqgcCr_vKH7cjFJwkvw-45Dfjs.png" },
        description: ("```"+(info.description?.slice(0,1900))+(info.description.length > 1900 ? "\n..." : "\u201b")+"```") ?? "Aucune description.",
        footer: { text: `Vidéo publiée le : ${require("dayjs")(info.publishDate)?.format("DD/MM/YYYY")}`}
      }],
      components: [{
          components: [{
              disabled: false, emoji: null, label: "La musique", style: 5, type: 2,
              url: (music?.url ?? "https://www.youtube.com")
          }], type: 1
      }]
    });
  },
  config: { name: "nowplaying", aliases: ["np"], category: "music", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}