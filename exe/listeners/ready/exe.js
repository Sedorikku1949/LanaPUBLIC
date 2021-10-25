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
  }, ms));

  database.interval.push(setInterval(async function(){
    Object.entries(database.commandCooldown).forEach((data) => { if ((data[1] + 120_000) <= Date.now()) { delete database.commandCooldown[data[0]]; } });
  }, 2*ms))
}

const { slashCommands, discordbotlist, statut } = Client;

module.exports = async() => {
  await Promise.all(client.guilds.cache.map(e => e.members.fetch()));
  await Promise.all(client.guilds.cache.map(guild => slashCommands.loadGuild(guild)));
  console.log(`{cyan}The application "${client.user.tag}" has been started successfully in ${(performance.now() - start).toFixed(2)}ms !`);
  slashCommands.loadAll();
  await client.user.setStatus("dnd");
  await client.user.setActivity("🎃 Trick or treat !", { type: "WATCHING"})

  discordbotlist();
  //statut();
  // save + system
  interval(30000); 

  Object.entries(database.language).forEach((e) => {
    const obj = { components: [
      {
        type: "SELECT_MENU",
        customId: "language",
        placeholder: "What language do you want me to speak ?",
        minValues: null,
        maxValues: null,
        options: [...Object.values(database.language).map(lang => ({
            label: lang.languageName ?? "ERROR",
            value: lang.systemLanguageName ?? "ERROR",
            description: lang.langDesc ?? `I will speak "${lang.languageName ?? "ERROR"}"`,
            emoji: lang.langEmj ?? "🏳️",
            default: false
          })
        )],
        disabled: false
      }
    ],type: "ACTION_ROW" };
    // update
    if (database.language[e[0]] && database.language[e[0]].misc && database.language[e[0]].misc.languageSelectMenu) database.language[e[0]].misc.languageSelectMenu = obj;
  })
};