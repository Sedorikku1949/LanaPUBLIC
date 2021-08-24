module.exports = {
  exe: async function(message, prefix, command, args, text){
    const msg = await message.channel.send({ embeds: [{ color: "2f3136", description: "> **Sauvegarde en cours...**" }] })
    const session = database.db.store.openSession();
    const data = await session.query("from @all_docs").all();
    const res = await hastebin.saveDatabase([{ name: "database", data: data}]);
    msg.edit({ embeds: [{ color: "2f3136", description: `**Sauvegardes :**\n${res.map(e => `\`${e.name}\` >> ${e.url}` ).join("\n")}` }] })
  },
  config: { name: "save", aliases: [], category: "dev", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: true } },
  path: null
}