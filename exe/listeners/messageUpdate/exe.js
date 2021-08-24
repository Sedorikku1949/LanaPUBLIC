module.exports = function(oldMessage, newMessage){
  if (newMessage.channel.type == "dm" || newMessage.author.bot || !newMessage.content) return
  require("../../managers/commandsManager").execute(newMessage)
  deleteCache(require.resolve("../../managers/commandsManager"))
}