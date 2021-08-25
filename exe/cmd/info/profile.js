const Discord = require("discord.js");
const Canvas = require("canvas");

//Canvas.registerFont(config.pathToProfileCardFont, { family: "Roboto Black" })

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    let user = args[0]?message.guild.members.selectMember(args[0]):message.member;
    if ( (args[0] && !user) || !(user instanceof Discord.GuildMember)) return message.reply(lang.assets.noUser);
    const canvas = Canvas.createCanvas(1200,675);
    let ctx = canvas.getContext("2d");
    const progress = new progressBar({ maxValue: 6, value: 0, length: 20 });
    const msg = await message.channel.send(lang.misc.progressMSG.replace(/{bar}/g, progress.draw()));

    // background
    const defaultBackground = await Canvas.loadImage(config.defaultProfileCardBackgroundPath)
    if (!(await database.db.get("user/"+message.author.id))?.profile?.banner){
      ctx.drawImage(defaultBackground,0,0,1200,675);
      progress.update(1); await msg.edit(lang.misc.progressMSG.replace(/{bar}/g, progress.draw()));
      // template
      const template = await Canvas.loadImage(config.profileCardWithNoBanner);
      ctx.drawImage(template, 0, 0, canvas.width, canvas.height)
    } else {
      const background = await Canvas.loadImage((await database.db.get("user/"+message.author.id))?.profile?.banner)
      ctx.drawImage(background,0,0,1200,675);
      progress.update(1); await msg.edit(lang.misc.progressMSG.replace(/{bar}/g, progress.draw()));
      // template
      const template = await Canvas.loadImage(config.profileCardTemplate);
      ctx.drawImage(template, 0, 0, canvas.width, canvas.height)
    }

    // pseudo
    ctx.font = "bold 40px 'Arial'";
    ctx.fillStyle = '#000000';
    ctx.stroke();
    ctx.fillText(user.user.tag, 375, 170, 650 );

    // lvl
    const lvl = String((await database.db.get("guild/"+message.guild.id, `xp["${message.author.id}"].lvl`)) || 0);
    ctx.font = "bold 25px 'Arial'";
    ctx.fillText("lvl : "+lvl, 410, 301.5, 650 );

    // xp
    const xp = ((await database.db.get("guild/"+message.guild.id, `xp["${message.author.id}"].xp`)) || 0);
    ctx.fillText("xp : "+xp.shortNumber(), 630, 301.5, 650 );

    // percent
    const percent = ((xp/((5 / 6) * lvl * (2 * lvl * lvl + 27 * lvl + 91) + 100))*100).toFixed(0);
    ctx.font = "bold 23px 'Arial'";
    ctx.fillText(percent+"%", 1090.5, 301, 650 );

    progress.update(1); await msg.edit(lang.misc.progressMSG.replace(/{bar}/g, progress.draw()));

    // bio
    const bio = (await database.db.get("user/"+message.author.id, `profile.bio`)) || lang.misc.noBio;
    ctx.font = "bold 23px 'Arial'";
    ctx.fillTextMultiline(bio, 350, 10, 20, 412, 25);

    progress.update(1); await msg.edit(lang.misc.progressMSG.replace(/{bar}/g, progress.draw()));

    // Bloc "autre" :
    // marry :
    const marry = await database.db.get("user/"+message.author.id, `profile.marryID`) ? message.guild.members.selectMember(await database.db.get("user/"+message.author.id, `profile.marryID`), { fetch: true }).tag || message.guild.members.selectMember(await database.db.get("user/"+message.author.id, `profile.marryID`), { fetch: true }).user.tag || "ERROR" : lang.misc.noMarry;
    ctx.font = "23px 'Arial'";
    ctx.fillText("Marrié(e) avec : "+marry, 700, 550);

    // score
    ctx.fillText("Score : "+((await database.db.get("user/"+message.author.id, `score`)) || "0"), 700, 650);
    progress.update(1); await msg.edit(lang.misc.progressMSG.replace(/{bar}/g, progress.draw()));

    // progress Bar
    ctx.fillStyle = "#E859A3"
    ctx.roundRect(canvas.width/2, canvas.height/2, 100, 20, 10).fill();
    ctx.restore();

    // badges
    const badges = (await database.db.get("user/"+message.author.id, "profile.badges"))
    if (badges.length > 0){
      //
    }

    // pp
    const pp = await Canvas.loadImage(user.user.displayAvatarURL({ size: 512, format: "png", dynamic: false }));
    ctx.circleImage(pp, 177, 154, 157);

    // send
    msg.delete().catch(()=>false);
    await message.channel.send({ files: [{name:"profile.png", attachment: canvas.toBuffer()}]});
  },
  config: { name: "profile", aliases: ["p", "rank"], category: "info", system: { perms: ["SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}