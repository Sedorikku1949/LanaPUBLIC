module.exports = {
    exe: function(message, prefix, command, args, text){
        const Canvas = require("canvas")
        message.channel.send("hello there")
    },
    config: { name: "test", aliases: ["t"], category: "dev", help: { desc: "...", use: "..." }, system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
    path: null
}