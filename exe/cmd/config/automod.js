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
    },
    config: { name: "automod", aliases: [], category: "config", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"], delInvoke: false, inProgress: true, staffCommand: true, devCommand: false } },
    path: null
};
