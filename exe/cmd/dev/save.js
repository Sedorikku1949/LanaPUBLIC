module.exports = {
  exe: async function(message, prefix, command, args, lang){
    const msg = await message.channel.send({ embeds: [{ color: "2f3136", description: "> **Sauvegarde en cours...**" }] })
    const session = database.db.store.openSession();
    const data = await session.query("from @all_docs").all();
    await session.saveChanges();
    const res = Buffer.from(JSON.stringify(data, null, 2));
    msg.edit({ embeds: [], content: "**Sauvegarde :**", files: [{ name: "database.json", attachment: res }] })
  },
  config: { name: "save", aliases: [], category: "dev", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: true } },
  path: null
}