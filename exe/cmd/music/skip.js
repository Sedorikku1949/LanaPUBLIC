const cooldown = {};

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (cooldown[message.author.id]) return;
    cooldown[message.author.id] = true;
    message.react(emojis.check.id).catch(() => false)
    if (!database.musicManager.get(message.guild.id)?.nowPlaying) return message.reply(lang.assets.noMusic) && delete cooldown[message.author.id];
    if (!message.member.voice?.channel || database.musicManager.get(message.guild.id).channel.id !== message.member.voice.channel?.id) return message.reply(lang.assets.nop) && delete cooldown[message.author.id];

    await database.musicManager.get(message.guild.id).skip(database.musicManager.get(message.guild.id).id, true);

    if (!database.musicManager.get(message.guild.id).queue[0]?.url) return delete cooldown[message.author.id];
    const info = await database.musicManager.get(message.guild.id).getVideoInfo(database.musicManager.get(message.guild.id).queue[0]?.url);
    if (!info) return console.log("no video info !") && delete cooldown[message.author.id];
    database.musicManager.get(message.guild.id).response.send({ embeds: [{
      color: "#5865F2",
      title: info.title.slice(0,255),
      url: info.video_url,
      author: { name: info.author.name, icon_url: info.author.thumbnails?.sort((a,b) => b.width - a.width)[0]?.url ?? "https://cdn.discordapp.com/attachments/832164618956832799/888732061828014080/9HZBYcvaOEnh4tOp5EqgcCr_vKH7cjFJwkvw-45Dfjs.png" },
      thumbnail: { url: info.thumbnails?.sort((a,b) => b.width - a.width)[0].url ?? "https://cdn.discordapp.com/attachments/832164618956832799/888732061828014080/9HZBYcvaOEnh4tOp5EqgcCr_vKH7cjFJwkvw-45Dfjs.png" },
      description: `Joue de la musique !`,
      footer: { text: `Vidéo publiée le : ${require("dayjs")(info.publishDate)?.format("DD/MM/YYYY")}`}
    }]}).catch(() => false);
    message.channel.send(`${emojis.error.msg} **Certains bugs dans les musiques sont connus, celles-ci ne dépendent pas des développeurs.**`);
    delete cooldown[message.author.id];
  },
  config: { name: "skip", aliases: ["s"], category: "music", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}