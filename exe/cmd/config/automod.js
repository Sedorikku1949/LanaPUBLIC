const MODES = {
    0: "delete",
    1: "mute",
    2: "kick",
    3: "softban",
    4: "ban"
};

const SPAMLEVEL = {
  0: {
      name: "low",
      limit: 40,
      range: 10 * 1000
    },
  1: {
    name: "moderate", // DEFAULT
    limit: 20,
    range: 5 * 1000
  },
  2: {
    name: "hard",
    limit: 10,
    range: 5 * 1000
  },
  3: {
    name: "legendary",
    limit: 5,
    range: 2 * 1000
  },
};

module.exports = {
    exe: async function(message, prefix, command, args, lang) {
      if (!config.dev.devID.includes(message.author.id)) return message.react("❌").catch(() => false); // commande encore en dev donc pas d'accès aux non devs
      const guildData = await database.db.get(`guild/${message.guild.id}"['_config'].automod`)
    
      if(!args[0]) return message.reply(lang["assets"]["invalidArgs"]);

      switch(args[0]) {
        case "anti-liens":
          switch(args[1]) {
            case "disable":
            break;
            case "enable":
            break;
            default:
              return message.reply(lang["assets"]["invalidArgs"])
          };
        break;
        default:
          return message.reply(lang["assets"]["invalidArgs"])
      }
    },
    config: { name: "automod", aliases: [], category: "config", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: true, staffCommand: true, devCommand: false } },
    path: null
};
