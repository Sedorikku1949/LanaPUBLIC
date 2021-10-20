const { readdirSync, existsSync, cp } = require("fs");
const { DiscordTogether } = require("discord-together")
const { Client, Intents } = require("discord.js");

async function wait(ms) { return new Promise((resolve, _) => { setTimeout(() => resolve(true), ms) }) };

// ENVIRONMENT
NODE = process.platform == "android" ? "/data/data/com.termux/files/usr/lib/node_modules/" : require.main.path+'\\node_modules\\'

module.exports = class Kady {
  async loadFunctions(){
    let start = performance.now();
    let i = 0;

    // Global functions
    readdirSync("exe/functions/global").forEach((dir) => {
      try {
        if (!dir.endsWith(".js")) return;
        global[dir.replace(/\.js/g, "")] = require(`../functions/global/${dir}`);
        delete require.cache[require.resolve(`../functions/global/${dir}`)];
        i++;
      } catch(err) {
        console.log(err)
        return console.log(`{red}{ /!\\ } >> An error as occured when loading "exe.js" at "exe/functions/global/${dir}" !`);
      };
    });
    require("../functions/ts.cjs");

    // UTILS FUNCTIONS FOR SYSTEM & GLOBAL USE
    global["fetch"] = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    console.log = async function(data) { typeof data == "string" ? process.stdout.write(color(data)+"\n") : process.stdout.write(require("util").inspect(data)+"\n") }

    // end
    console.log(`{cyan}{ FUNCTIONS } >> ${i} functions has been loaded in the global in ${(performance.now() - start).toFixed(2)}ms !`);
    return true;
  };

  async loadPrototypes(){ 
    const start = performance.now();
    const proto = require("../functions/prototype.js");
    await Promise.all(proto.map(e => e))
    console.log(`{cyan}{ PROTO } >> ${proto.length} prototypes has been loaded in ${(performance.now() - start).toFixed(2)}ms !`)
  };

  async loadEvents(client){
    let [i, error] = [0, []];
    readdirSync("exe/listeners").forEach(function(dir){
      if (dir.match(/(\.([a-zA-Z]+))|sub/g)) return console.log(`{yellow}{ /!\\ } >> The file "exe/listeners/${dir}" as been ignored by the event loader.`);
      if (!existsSync(`exe/listeners/${dir}/exe.js`)) return console.log(`{red}{ /!\\ } >> The folder "exe/listeners/${dir}" as been ignored by the event loader because he have no "exe.js".`);
      try {
        const start = performance.now();
        client.on(dir, require(`../listeners/${dir}/exe.js`));
        console.log(`{blue}{ EVENTS } >> The event "${dir}" has been successfully loaded at "exe/listeners/${dir}/exe.js" in ${(performance.now() - start).toFixed(2)}ms`);
        i++;
      } catch(err) {
        console.log(`{red}{ /!\\ } >> An error as occured when loading "exe.js" at "exe/listeners/${dir}" !`);
        error.push({ file: `${dir}/exe.js`, err});
      };
    });
    console.log(`{green}${i} events has been loaded successfully !`);
    if (error.length > 0) console.log(`{red}{ /!\\ } Some error as occured when loading all events !\n\n`+error.map(err => require("util").inspect(err)).join("\n"));
    return client
  };

  async loadDatabase(){
    this.database = new (class secureDatabase{
      constructor(){
        this.db = new (require("../../database/src"))({ url: "http://127.0.0.1:8080", name: process.platform=="win32"?"sayoTest":"lanaPUBLIC"});
        this.language = {};
        this.config = global["config"];
        this.xpCooldown = {};
        this.crypto = (new (require("../functions/Class/encrypt.js"))());
        this.commands = require("./commandsManager").init();
        this.clientStats = new (require("../functions/Class/clientStats.js"))();
        this.interval = [];
      }
    })()
  }

  async loadLangFiles(){
    let list = {};
    readdirSync("exe/_storage/_langs").forEach(function(dir){
      try { list[dir.replace(/\.([a-zA-Z]+)/g, "")] = require(`../_storage/_langs/${dir}`) }
         catch(err) { console.log(`{red}{ /!\\ } >> An error as occured when loading the file "${dir}" at "exe/_storage/_langs/${dir}"`) };
    });
    this.database.language = list;
    console.log("{green}The database has been successfully loaded");
    return true;
  }

  async start(){
    global["start"] = performance.now()
    // NEEDED FUNCTIONS FOR ENV
    await this.loadFunctions();
    await this.loadPrototypes();

    // start Client
    const config = require("../_storage/_config/boot.json");
    global["config"] = require("../_storage/_config/config.json");
    global["emojis"] = require("../_storage/_config/emojis.json");
    if (!this.reload || typeof this.reload !== "object") this.reload = undefined;
    this.interval = [];
    this.options = {
      intents: Object.keys(Intents.FLAGS),
      partials: ["CHANNEL"],
      fetchAllMembers: true,
      allowedMentions: { repliedUser: false },
      retryLimit: 5,
      invalidRequestWarningInterval: 10
    };
    this.client = new Client(this.options);
    this.client.discordTogether = new DiscordTogether(this.client);
    this.client["prefix"] = config.prefix

    // global :
    global["database"] = this.database;

    // loads :
    this.client = await this.loadEvents(this.client);
    await this.loadDatabase();
    await this.loadLangFiles();

    await this.client.login(config.token);

    this.database.Client = this;

    // global :
    global["client"] = this.client;
    global["database"] = this.database;

    if (typeof this.reload == "object" && this.reload.msg && this.reload.channel) {
      this.client.channels.fetch(this.reload.channel).then(async(chl) => {
        chl?.messages.fetch(this.reload.msg).then(async(msg) => {
            this.reload = undefined;
            await msg.edit({ embeds: [{ color: "#5865F2", description: `${emojis.check.msg} **J'ai redémarré avec succès !**` }] });
          }).catch((err) => console.log(err));
      })
    }
  }

  constructor(reload = false, test = false){ this.start(reload, test); }

  async reloadAll(){
    try {
      console.log("\n{red}{ RELOAD } >> Starting reloading...")

      // reload
      this.database.commands = [];
      this.client?.destroy();
      delete global["client"];
      delete global["config"];
      delete global["emojis"];
      await Promise.all(this.interval.map(e => { clearInterval(e) }));
      console.log("{red}{ RELOAD } >> Restart the Client and database...\n")
      await this.start();

      // ended
      return true;
    } catch(err) {
      console.log(err);
      console.log("{red}{ /!\\ RELOAD_MANAGER } >> An error as occured while reloading, exist with code 1 !");
      process.exit(1)
    }
  };
  async reloadEvents(){
    try {
      console.log(Object.keys(this.client._events).forEach((event) => { existsSync(`exe/listeners/${event}/exe.js`) ? deleteCache(require.resolve(`../listeners/${event}/exe.js`)) : false }));
      this.client = await this.loadEvents(this.client);
      return true;
    } catch(err) {
      return err;
    };
  };
  async reloadCommands(){
    if (!this.database?.commands) return null;
    try {
      this.database.commands = [];
      this.database.commands.forEach(({ path }) => { deleteCache(require.resolve(`../../${path}`)) });
      this.database.commands = await require("./commandsManager").init();
      return true;
    } catch(err) {
      return err;
    };
  };
  async reloadFunctions(){
    if (!this.loadFunctions) return null;
    try {
      this.loadFunctions();
      return true
    } catch(err) {
      return err;
    };
  };
  async reloadPrototypes(){
    if (!this.loadFunctions) return null;
    try {
      this.loadPrototypes();
      return true
    } catch(err) {
      return err;
    };
  };
  async reloadLangs(){
    if (!this.loadLangFiles) return null;
    try {
      this.loadLangFiles();
      return true
    } catch(err) {
      return err;
    };
  };
}