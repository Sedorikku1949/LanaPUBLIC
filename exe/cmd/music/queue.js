module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!database.musicManager.get(message.guild.id)?.nowPlaying) return message.reply(lang.assets.noMusic);
    if (!message.member.voice?.channel || database.musicManager.get(message.guild.id).channel.id !== message.member.voice.channel?.id) return message.reply(lang.assets.nop);
    const embeds = database.musicManager.get(message.guild.id).queue.filter(e => e.info && typeof e.info == "object" && !Array.isArray(e.info)).slice(1).map((e, index) => {
      const info = e.info;
        return ({
        embeds: [{
          color: "#5865F2",
          title: info.title.slice(0,255),
          url: info.video_url,
          description: `Position dans la queue : ${index+1}`,
          author: { name: info.author.name, icon_url: info.author.thumbnails?.sort((a,b) => b.width - a.width)[0]?.url ?? "https://cdn.discordapp.com/attachments/832164618956832799/888732061828014080/9HZBYcvaOEnh4tOp5EqgcCr_vKH7cjFJwkvw-45Dfjs.png" },
          thumbnail: { url: info.thumbnails?.sort((a,b) => b.width - a.width)[0].url ?? "https://cdn.discordapp.com/attachments/832164618956832799/888732061828014080/9HZBYcvaOEnh4tOp5EqgcCr_vKH7cjFJwkvw-45Dfjs.png" },
          footer: { text: `Vidéo publiée le : ${require("dayjs")(info.publishDate)?.format("DD/MM/YYYY")}`}
        }]
      })
    });
    if (embeds.length < 1) return message.reply(lang.assets.noQueue);
    if (embeds.length == 1) return message.reply(embeds[0]);
    // if multiple musics in queue
    let [x, msg] = [0, await message.channel.send(embeds[0]).catch(() => false)];
    if (!msg) return;
    await Promise.all([emojis.undo.id, emojis.redo.id, emojis.close.id].map(e => msg.react(e)))
    const collector = msg.createReactionCollector({ time: 60000, filter: (react, user) => user.id == message.author.id && [emojis.undo.id, emojis.redo.id, emojis.close.id].includes(react.emoji.id)})
    collector.on('collect', async function(react){
      switch(react.emoji.id){
        case emojis.undo.id:{/* undo */ x = decrease(x, embeds); msg.edit(embeds[x]).catch(() => false); react.users.remove(message.author.id).catch(() => 0); break;};
        case emojis.redo.id:{ /* redo */ x = increase(x, embeds); msg.edit(embeds[x]).catch(() => false); react.users.remove(message.author.id).catch(() => 0); break; };
        case emojis.close.id:{ /* close */ collector.stop(); break; }
      }
    })
    collector.on('end', async function(){ msg.reactions?.removeAll().catch(() => false)} )
  },
  config: { name: "queue", aliases: [], category: "music", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}