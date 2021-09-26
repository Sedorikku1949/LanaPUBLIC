const cooldown = {};
const ytsr = require('ytsr');

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (cooldown[message.author.id]) return;
    cooldown[message.author.id] = true;
    if (!args[0]) return message.reply(lang.assets.noArgs)
    
    //let url = message.content.slice(prefix.length+command.length+1).trim();


    // video search
    let url = message.content.slice(prefix.length+command.length+1).trim().replace(/(http:|https:)?\/\/(www\.|m\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(v\/)?([^\s|^\&]+)?([^\s]+)?/gm, "$7");
    url = await ytsr.getFilters(url).then(flt => flt.get('Type').get('Video'));
    url = (await ytsr(url?.url, { limit: 1, type: 'video', }))?.items[0]?.url;
    if (!url || typeof url !== "string") return message.reply(lang.assets.noVideoFound) && delete cooldown[message.author.id];


    if (!message.member.voice.channel) return message.reply(lang.assets.noVoiceChannel) && delete cooldown[message.author.id];
    await message.react(emojis.check.id).catch(() => false)
    // guild create + join
    if (!database.musicManager.get(message.guild.id)) await database.musicManager.create(message.member.voice.channel, message);
    await database.musicManager.get(message.guild.id).join();
    // ajout a la queue
    await database.musicManager.get(message.guild.id).queue.push({ author: message.author.id, url: url, info: (await database.musicManager.get(message.guild.id).getVideoInfo(url)) });
    if (database.musicManager.get(message.guild.id).queue.length > 7000) return message.reply(lang.assets.cantAddMoreMusic) && delete cooldown[message.author.id];
    if (database.musicManager.get(message.guild.id).nowPlaying) return message.reply(lang.assets.queue) && delete cooldown[message.author.id];
    // playing
    await database.musicManager.get(message.guild.id).startPlaying(database.musicManager.get(message.guild.id).queue[0]?.url)
    
    const info = await database.musicManager.get(message.guild.id).getVideoInfo(database.musicManager.get(message.guild.id).queue[0].url);
    // message
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
    message.channel.send(`${emojis.error.msg} **Certains bugs dans les musiques sont connus, ceux-ci ne dépendent pas des développeurs.**`)
    delete cooldown[message.author.id];
  },
  config: { name: "play", aliases: [], category: "music", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}