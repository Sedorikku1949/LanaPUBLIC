const Discord = require("discord.js");
const Canvas = require("canvas");

Canvas.registerFont(config.pathToProfileCardFont, { family: "roboto" })

module.exports = {
exe: async function(message, prefix, command, args, lang){
  let user = args[0]?message.guild.members.selectMember(args[0]):message.member;
  if ( (args[0] && !user) || !(user instanceof Discord.GuildMember)) return message.reply(lang.assets.noUser);
  const canvas = Canvas.createCanvas(1200,675);
  const ctx = canvas.getContext("2d");
  const progress = new progressBar({ maxValue: 10, value: 0, length: 20 });
  const msg = await message.channel.send(lang.misc.progressMSG.replace(/{bar}/g, progress.draw()));
  
  // background
  const defaultBackground = await Canvas.loadImage(config.defaultProfileCardBackgroundPath)
  if (!(await database.db.get("user/"+message.author.id))?.profile?.banner){
    await ctx.drawImage(defaultBackground,0,0);
  } else {
    const background = await Canvas.loadImage((await database.db.get("user/"+message.author.id))?.profile?.banner)
    await ctx.drawImage(background,0,0);
  }

  progress.update(1); await msg.edit(lang.misc.progressMSG.replace(/{bar}/g, progress.draw()));

  msg.delete().catch(()=>false)
  await message.channel.send({ files: [{name:"profile.png", attachment: canvas.toBuffer()}]})
  
},
config: { name: "profile", aliases: ["p", "rank"], category: "info", system: { perms: ["SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
path: null
}