module.exports = {
    exe: function(message, prefix, command, args, text){
        message.channel.send("hello there")
    },
    config: { name: "test", aliases: ["t"], help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
    path: null
}