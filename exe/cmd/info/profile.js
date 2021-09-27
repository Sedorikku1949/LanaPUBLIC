const Discord = require("discord.js");
const Canvas = require("canvas");

function filterBadges(userBadges){
  let res = [];
  if (userBadges.includes("HAVE_INVITED_CLIENT")) res.push("INVITATION");
  if (userBadges.includes("IS_IN_SUPPORT_GUILD")) res.push("SUPPORT");
  return res;
}

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    const user = args[0] ? message.guild.members.selectMember(args[0], { user: true }) : message.author
    if (!user || !(user instanceof require("discord.js").User)) return message.reply({ "embeds": [{ "color": "#FF2A51", "description": "> **Je n'ai pas trouvé cette personne !**" }] });
    const userData = await database.db.get("guild/"+message.guild.id, `xp["${user.id}"]`);
    if (!userData) return message.reply({ "embeds": [{ "color": "#FF2A51", "description": "> **Une erreur est survenue en chargeant la base de donnée.**" }] });
    const embeds = { embeds: [{
      color: "#5865F2",
      footer: { text: "Cette commande arrive prochainement en image avec un profile personnalisé !" },
      author: { name: user.tag, icon_url: user.displayAvatarURL({ dynamic: true }) },
      fields: [
        { name: "Progression du niveau :", value: "```\n"+( (new progressBar({ maxValue: (5 / 6) * userData.lvl * (2 * userData.lvl * userData.lvl + 27 * userData.lvl + 91) + 100, value: userData.xp, length: 15 })).draw() )+"\n```" , inline: false},
        { name: "Niveau :", value: String(userData.lvl), inline: true },
        { name: "Points d'xp :", value: String((userData.xp).shortNumber()), inline: true },
      ]
    }]};
    message.reply(embeds)
    /*
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
    ctx.fillText(user.user.tag, 200, 200, 650 );

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
    const badges = (await database.db.get("user/"+message.author.id, "profile.badges")) ?? []
    if (badges.length > 0){
      let dim = 100;
      const availableBadges = filterBadges(badges);
      let [x,y] = [200, 200];
      availableBadges.slice(0,4).forEach(async function(bdg){
        try {
          console.log(y)
          const bdgIMG = await Canvas.loadImage(config.badgesIMG[bdg]);
          ctx.drawImage(bdgIMG, x, y, dim, dim);
          y += dim+20;
        } catch(err) {};
      });
    };

    // pp
    const pp = await Canvas.loadImage(user.user.displayAvatarURL({ size: 512, format: "png", dynamic: false }));
    ctx.circleImage(pp, 197.56, 169.5, 157.5);

    // send
    msg.delete().catch(()=>false);
    await message.channel.send({ files: [{name:"profile.png", attachment: canvas.toBuffer()}]});*/
  },
  config: { name: "profile", aliases: ["rank"], category: "info", system: { perms: ["SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}