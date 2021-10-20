let lastSave = null;

const { getDate } = Utils;

async function interval(ms) {
  database.interval.push(setInterval(async function(){
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

const { slashCommands, discordbotlist, statut } = Client;

module.exports = async() => {
    await Promise.all(client.guilds.cache.map(e => e.members.fetch()));
    await Promise.all(client.guilds.cache.map(guild => slashCommands.loadGuild(guild)));
    console.log(`{cyan}The application "${client.user.tag}" has been started successfully in ${(performance.now() - start).toFixed(2)}ms !`);
    slashCommands.loadAll();
    await client.user.setStatus("dnd");
    await client.user.setActivity("🎃 Trick or treat !",{ type: "WATCHING"})

    discordbotlist();
    //statut();
    // save + system
    interval(30000);
};