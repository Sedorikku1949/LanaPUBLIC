/*
- anti badword: v
- anti invitation: v
- anti mass mention: v
- anti @[everyone|here]: x
- anti spam (optionel): x
*/

const { TextChannel, Message } = require("discord.js")

try {
  var badwords = require("../_storage/_config/badword.json"); deleteCache(require.resolve("../_storage/_config/badword.json"));
} catch(err) {
  var badwords = []
};


/**
 * @param {Message} message
 */
module.exports = async function(message) {
  if(!(message instanceof Message) || !(message.channel instanceof TextChannel)) return;
  if (!message.content || typeof message.channel.type == "DM" || message.author.bot) return;
  
  let args = message.content.split(/\s+/g);
  const lang = (clone(await database.db.get("user/"+message.author.id) ? (database.language[await database.db.get("user/"+message.author.id).lang] || database.language.fr) : database.language.fr ))?.misc?.automod,
        inviteRegex = /(https?:\/\/)?(www.)?(discord.(gg|io|me|li)|discord.com\/invite|discordapp.com\/invite)\/.+[a-z]/gi,
        users = new Map(),
        limit = 10,
        range = 5 * 1000;

  console.log(users.set(message.author.id, {
    lastMessage: message.createdTimestamp,
    count: 1
  }))

  if(users.get(message.author.id)) {
    let user = users.get(message.author.id);

    while(user[count] > limit) {
      message.reply(lang["antispam"])
      break;
    }

    if(user[lastMessage] + range < Date.now()) {
      user[count]++;
      user[lastMessage] = message.createdTimestamp
    } else user[count] = 1;
  } else {
    users.set(message.author.id, {
      lastMessage: message.createdTimestamp,
      count: 1
    });
  };

  if(args.some((arg) => badwords.includes(arg.toLowerCase()))) { return message.reply(lang["badwords"]) };
  
  if(inviteRegex.test(message.content)) { message.reply(lang["link"]).catch(console.error); await message.delete().catch(console.error) };

  if(message.mentions.members.size >= 8) {
    message.reply(lang["mentions"])
    .then(message.delete())
    .catch(console.error)
 };
};