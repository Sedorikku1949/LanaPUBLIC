function expliciteFilter(str) {
  switch (str) {
    case "DISABLED": return 0;
    case "MEMBERS_WITHOUT_ROLES": return 1;
    case "ALL_MEMBERS": return 2;
  }
}

function verificationLevel(str) {
  switch (str) {
    case "NONE": return 0;
    case "LOW": return 1;
    case "MEDIUM": return 2;
    case "HIGH": return 3;
    case "VERY_HIGH": return 4;
  }
}

const { getDate } = Utils;
const { date } = Client;

module.exports = {
  exe: async function (message, prefix, command, args, lang) {
    switch(args[0]){
      case "icon": {
        message.reply({ embeds: [{
          color: message.guild.colors("embed"),
          image: { url: (message.guild.iconURL({ size: 2048, format: "png", dynamic: true }) || "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png") },
          description: message.guild.translate(lang+"assets.LINK", (message.guild.iconURL({ size: 2048, format: "png", dynamic: true }) || "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png")) 
        }] })
        break;
      };
      case "banner": {
        if (!message.guild.bannerURL()) return message.reply(message.guild.translate(lang+"assets.NO_BANNER"))
        message.reply({ embeds: [{
          color: message.guild.colors("embed"),
          image: { url: (message.guild.bannerURL({ size: 2048, format: "png", dynamic: true }) || "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png") },
          description: message.guild.translate(lang+"assets.LINK", (message.guild.bannerURL({ size: 2048, format: "png", dynamic: true }) || "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png")) 
        }] })
        break;
      };
      default: {
        message.reply({ embeds: [{
          color: message.guild.colors("mainColor"),
          title: message.guild.translate(lang+"assets.TITLE", message.guild.name),
          thumbnail: { url: message.guild.iconURL({ size: 2048, dyanmic: true, format: "png" }) || "https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Discord_Logo_sans_texte.svg/1818px-Discord_Logo_sans_texte.svg.png" },
          fields: [
            { name: message.guild.translate(lang+"assets.OWNER_NAME"), value: message.guild.translate(lang+"assets.OWNER_VALUE", (client.users.cache.get(message.guild.ownerId)?.tag ?? message.guild.ownerId), message.guild.ownerId), inline: false },
            { name: message.guild.translate(lang+"assets.CREATED_NAME"), value: message.guild.translate(lang+"assets.CREATED_VALUE",  (getDate(message.guild.createdTimestamp, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)), (Math.trunc(message.guild.createdTimestamp/1000)) ), inline: false },
            { name: "AFK :", value: message.guild.afkChannelId ? message.guild.translate(lang+"assets.AFK_VALUE", client.channels.cache.get(message.guild.afkChannelId)?.name, (new date(Date.now() - Number(message.guild.afkTimeout + "000")).durationToNow)) : message.guild.translate(lang+"misc.NO_AFK_CHANNEL"), inline: false },
            { name: "Boost :", value: message.guild.premiumSubscriptionCount > 0  ? message.guild.translate(lang+"assets.BOOST_VALUE", message.guild.premiumSubscriptionCount, "T"+message.guild.premiumTier.toLowerCase().trim().replace(/_/g, " ").slice(1)) : message.guild.translate(lang+"misc.NO_BOOST"), inline: true },
            { name: message.guild.translate(lang+"assets.COMMU_NAME"), value: message.guild.translate(lang+"assets.COMMU_VALUE", message.guild.memberCount - message.guild.members.cache.filter((e) => e.user.bot).size, message.guild.members.cache.filter((e) => e.user.bot).size, message.guild.memberCount), inline: true },
            { name: message.guild.translate(lang+"assets.CHANNEL_NAME"), value: message.guild.translate(lang+"assets.CHANNEL_VALUE", message.guild.channels.cache.filter((e) => e.type == "GUILD_CATEGORY").size, message.guild.channels.cache.filter((e) => e.type == "GUILD_TEXT").size, message.guild.channels.cache.filter((e) => e.type == "GUILD_VOICE").size, message.guild.channels.cache.filter((e) => e.type == "GUILD_NEWS").size), inline: false },
            { name: message.guild.translate(lang+"assets.OTHER_NAME"), value: message.guild.translate(lang+"assets.OTHER_VALUE", (message.guild.systemChannel ? message.guild.systemChannel.toString() : message.guild.translate(lang+"misc.NO_SYSTEM_CHANNEL")), message.guild.translate(lang+`misc.explicit["${expliciteFilter(message.guild.explicitContentFilter)}"]`), message.guild.rulesChannelId ? client.channels.cache.get(message.guild.rulesChannelId).toString() : message.guild.translate(lang+"misc.NO_RULE_CHANNEL"), message.guild.translate(lang+`misc.verif["${verificationLevel(message.guild.verificationLevel)}"]`)), inline: false }
          ],
          footer: { text: "© Lana - 2021" }
        }] });
      };
    }
  },
  config: { name: "serv", aliases: ["server", "si", "serverinfo"], category: "info", system: { perms: ["SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}
