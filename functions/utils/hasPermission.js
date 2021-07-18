const Discord = require("discord.js")

module.exports = function(message, permissionNeeded){
    if ( !(message instanceof Discord.Message) || !Array.isArray(permissionNeeded)) return true;
    const clientPermissionInThisChannel = message.channel.permissionsFor(client.user.id).toArray()
    const permissionForget = permissionNeeded.filter(e => !clientPermissionInThisChannel.includes(e))
    if (permissionForget.length <= 0) return false;
    return permissionForget;
}