module.exports = async function(oldMessage, newMessage){
  if (newMessage.channel.type == "dm" || newMessage.author.bot || !newMessage.content) return
  await database.clientStats.dailyKeyChecker(require("dayjs")(new Date()).format("DD-MM-YYYY"));
  await database.db.ensure("blacklist", []);
  require("../../managers/commandsManager").execute(newMessage)
  deleteCache(require.resolve("../../managers/commandsManager"))
}