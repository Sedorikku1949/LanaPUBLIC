/*
- anti badword: v
- anti invitation: v
- anti mass mention: v
- anti @[everyone|here]: x
- anti spam (optionel): v (check si il ban/unban vraiment (histoire de permissions j'ai pas pu tester))
*/

/*
  exe/_storage/_config/config.json:
  ACTIONS:
    0: delete
    1: mute
    2: kick
    3: softban
    4 ban
*/

const { TextChannel, Message } = require("discord.js")

try {
  var badwords = require("../_storage/_config/badword.json"); deleteCache(require.resolve("../_storage/_config/badword.json"));
} catch(err) {
  var badwords = []
};

const users = new Map();

/**
 * @param {Message} message
 */
module.exports = async function(message) {
  if (message?.guild?.id !== "831842750538186772") return; // dev 

  if(config["dev"]["devID"].includes(message.author.id)) return;
  if(!(message instanceof Message) || !(message.channel instanceof TextChannel)) return;
  if (!message.content || typeof message.channel.type == "DM" || message.author.bot) return;
  
  let args = message.content.split(/\s+/g);
  const lang = (clone(await database.db.get("user/"+message.author.id) ? (database.language[await database.db.get("user/"+message.author.id).lang] || database.language.fr) : database.language.fr ))?.misc?.automod,
        inviteRegex = /(https?:\/\/)?(www.)?(discord.(gg|io|me|li)|discord.com\/invite|discordapp.com\/invite)\/.+[a-z]/gi,
        limit = 10,
        range = 5 * 1000;

  if(users.get(message.author.id)) {
    user = users.get(message.author.id)

    if(user["lastMessage"] + range > Date.now()) {
      users.set(message.author.id, {
        count: user["count"] + 1,
        lastMessage: message.createdTimestamp
      });

      if(user["count"] >= limit) {
        const embed = lang["antispam"]
        embed["embeds"][0]["description"] = embed["embeds"][0]["description"].replace(/{user}/, message.author);
        const ban = await message.member.ban().catch(() => false);
        if(ban) {
          const unban = await message.guild.members.unban(message.author.id);
          if(unban) message.channel.send(embed).catch(() => false);
        };
        users.delete(message.author.id);
      };
    } else {
      users.delete(message.author.id);
    };
  } else {
    users.set(message.author.id, {
      count: 1,
      lastMessage: message.createdTimestamp
    });
  };

  if(args.some((arg) => badwords.includes(arg.toLowerCase().replace(/^\D/g, "")))) {
    const embed = lang["badwords"];
    embed["embeds"][0]["description"] = embed["embeds"][0]["description"].replace(/{user}/, message.author);

    message.channel.send(embed)
    .then(message.delete())
    .catch(console.error);
    };
  
  if(inviteRegex.test(message.content)) {
    const embed = lang["link"];
    embed["embeds"][0]["description"] = embed["embeds"][0]["description"].replace(/{user}/, message.author);

    message.channel.send(embed)
    .then(message.delete())
    .catch(console.error);
  };

  if(message.mentions.members.size >= 8) {
    const embed = lang["mentions"];
    embed["embeds"][0]["description"] = embed["embeds"][0]["description"].replace(/{user}/, message.author);

    message.channel.send(embed)
    .then(message.delete())
    .catch(console.error);
 };
};
