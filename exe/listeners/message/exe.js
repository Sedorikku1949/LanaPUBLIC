module.exports = function(message){
    console.log("message")
    if (message.channel.type == "dm" || message.author.bot || !message.content) return
    require("../../managers/commandsManager").execute(message)
}