let lastSave = null;

async function interval(ms) {
  global["interval"].push(setInterval(async function(){
    // database save
    if (getDate(Date.now(), "[hh]:[mm]") == "12:00" && getDate(Date.now(), "[DD]_[MM]_[YYYY]") !== lastSave) {
      lastSave = getDate(Date.now(), "[DD]_[MM]_[YYYY]");
      const session = database.db.store.openSession();
      const data = await session.query("from @all_docs").all();
      await session.saveChanges();
      const res = Buffer.from(JSON.stringify(data, null, 2));
      client.channels.cache.get("889094522431225867")?.send({
        content: `**Sauvegarde du ${lastSave} :**`,
        files: [{ name: `database_${lastSave}.json`, attachment: res }],
      })
    }
  }, ms))
}

module.exports = async() => {
    await Promise.all(client.guilds.cache.map(e => e.members.fetch()));
    await Promise.all(client.guilds.cache.map(guild => slashCommands.loadGuild(guild)));
    console.log(`{cyan}The application "${client.user.tag}" has been started successfully in ${Date.now() - start}ms !`);
    slashCommands.loadAll();
    await client.user.setStatus("dnd");
    await client.user.setActivity("#LanaForEver ♥️",{ type: "WATCHING"})
    //statut();
    // save + system
    interval(30000);
};