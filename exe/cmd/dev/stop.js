module.exports = {
  exe: async function(message, prefix, command, args, text){
    await message.channel.send({ embeds: [{ color: "2f3136", description: `${emojis.error.msg} **Arrêt du bot...**` }] });
    global["client"].destroy();
    process.exit(0);
  },
  config: { name: "stop", aliases: [], category: "dev", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: true } },
  path: null
}