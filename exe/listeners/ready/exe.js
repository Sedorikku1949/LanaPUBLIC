let lastSave = null;

async function interval(ms) {
  global["interval"].push(setInterval(async function(){
    // database save
    if (getDate(Date.now(), "[hh]:[mm]") == "00:07" && getDate(Date.now(), "[DD]/[MM]/[YYYY]") !== lastSave) {
      lastSave = getDate(Date.now(), "[DD]/[MM]/[YYYY]");
      const session = database.db.store.openSession();
      const data = await session.query("from @all_docs").all();
      hastebin.saveDatabase([{ name: "database", data: data}]).then((codes) => {
        client.channels.cache.get("870602854350585866")?.send({ embeds: [{ color: "2f3136", footer: { text: `sauvegarde du ${lastSave}` }, description: `**Sauvegardes :**\n${codes.map(e => `\`${e.name}\` >> ${e.url}` ).join("\n")}` }] })
      })
    }
  }, 30000))
}

module.exports = async() => {
    await Promise.all(client.guilds.cache.map(e => e.members.fetch()));
    await Promise.all(client.guilds.cache.map(guild => slashCommands.loadGuild(guild)));
    console.log(`{cyan}The application "${client.user.tag}" has been started successfully in ${Date.now() - start}ms !`);
    slashCommands.loadAll()
    statut();
    interval()
};