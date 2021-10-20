module.exports = {
    exe: function (message, prefix, command, args, text) {
      message.channel.send("a");
    },
    config: {
      name: "test",
      aliases: ["t"],
      category: "dev",
      help: { desc: "...", use: "..." },
      system: {
        perms: ["SEND_MESSAGES"],
        delInvoke: false,
        inProgress: false,
        staffCommand: false,
        devCommand: true,
      },
    },
    path: null,
  };
  