const fs = require("fs");
const Discord = require("discord.js");

async function wait(ms) {
  return new Promise((resolve, _) => { setTimeout(() => resolve(true), ms) });
};

class secureDatabase{
  constructor(){
    this.db = new (require("../../database/src"))({ url: "http://127.0.0.1:8080", name: process.platform=="win32"?"sayoTest":"lanaPUBLIC"});
    this.language = {};
    this.config = global["config"];
    this.xpCooldown = {};
    this.crypto = (new encrypt());
    this.commands = require("./commandsManager").init();
    this.clientStats = (new clientStats.clientStats());
    this.guilds = new guilds();
    this.games = new games();
  }
}

const secureDb = new secureDatabase();

module.exports = class eventManager {
  static loadEvent = async function(){
    return new Promise(async function(resolve,_){
      let error = [];
      let i = 0;;
    
      fs.readdirSync("exe/listeners").forEach((dir) => {
        if (dir.match(/\./g)) return console.log(`{yellow}{ WARNING }  >>  The file "exe/listeners/${dir}" has been ignored by the event loader`)
        if (!fs.existsSync(`exe/listeners/${dir}/exe.js`)) return console.log(`{red}{ ERROR }  >>  The folder "exe/listeners/${dir}" doesn't have a file named "exe.js"`)
        try { const m = Date.now(); client.on(dir, require(`../listeners/${dir}/exe.js`)); console.log(`{blue}{ EVENTS }  >> The event "exe/listeners/${dir}" has been successfully loaded at exe/listeners/${dir}/exe.js" in ${Date.now() - m}ms`); i++ }
        catch(err) { console.log(`{red}{ EVENT ERROR }  >>  An error as occured when loading "exe/listeners/${dir}/exe.js""`); error.push({file: `${dir}/exe.js`, error: err}) }
      });
      console.log(`{green}${i} event(s) has been successfully loaded`);
      if (error.length > 0) console.log(`{red}{ WARNINGS } Some error as occured when loading all events !\n\n`+error.map(err => require("util").inspect(err)).join("\n"))
      resolve(error);
    })
  }


  // TEMPORARY
  static bdd = async function(){
    return new Promise(async function(resolve,_){
      global["database"] = {
        get db(){ return secureDb.db },
        get language(){ return secureDb.language },
        get config(){ return secureDb.config },
        get xpCooldown(){ return secureDb.xpCooldown },
        get crypto(){ return secureDb.crypto },
        get commands(){ return secureDb.commands },
        get clientStats(){ return secureDb.clientStats },
        get guilds(){ return securedDb.guilds },
        get games(){ return securedDb.games }
      };
      resolve(true)
    })
  }

  // languages file loader
  static languages = async function(){
    return new Promise(async function(resolve,_){
      let list = {};
      fs.readdirSync("exe/_storage/_langs").forEach( (dir) => {
        try { list[dir.replace(/\.json/g, "")] = require(`../_storage/_langs/${dir}`) ; deleteCache(require.resolve(`../_storage/_langs/${dir}`)) }
         catch(err) { console.log(`{red}{ ERROR } >> An error as occured when loading the file "${dir}" at "exe/_storage/_langs/${dir}"`) };
      });
      Object.defineProperty(global["database"], "language", {
        value: list,
        writable: false
      });
      console.log("{green}The database has been successfully loaded");
      resolve(true)
    })
  }


  static reload = async function(){
    const reload = config.reload;
    delete global["config"]; delete global["emojis"];
    global["interval"].forEach(e => { clearInterval(e) }); delete global["interval"];
    global["client"].destroy(); delete global["client"];
    this.start(reload);
  }


  static async start(reload = false){
    await wait(1000);
  
    // lancement
    global["config"] = require("../_storage/_config/config.json"); global["emojis"] = require("../_storage/_config/emojis.json"); global["interval"] = [];
    global["client"] = new Discord.Client({ intents: 32767, partials: ["CHANNEL"], fetchAllMembers: true, allowedMentions: { repliedUser: false, } })
    const { DiscordTogether  } = require('discord-together');
    global["client"].discordTogether = new DiscordTogether(global["client"]);
    global["start"] = Date.now();
    client.prefix = require("../_storage/_config/boot.json").prefix;
    
    // event loader
    await this.loadEvent();
    await this.bdd(require("../_storage/_config/boot.json").id);
    await this.languages();

    // login
    await client.login(require("../_storage/_config/boot.json").token);
    
    // security
    global["evalC"] = false
    let token = null
    Object.defineProperty(global["client"], "token", {
      get: function(){
        if(global["evalC"]){
          return false;
        } else {
          return token;
        };
      },
      set(value){
        if(token === null)return token = value;
        return false;
      },
      enumerable:false
    })
    client.token = require("../_storage/_config/boot.json").token;
    
    // reload msg
    if (reload && reload.msg && reload.channel) {
      await wait(1000);
      await client.channels.cache.get(reload.channel)?.messages.fetch(reload.msg).then(async(msg) => {
        await msg.edit({ embeds: [{ color: "#5865F2", description: `${emojis.powerbutton.msg} **J'ai redémarré avec succès !**` }] });
      }).catch(() => false);
    }
  
    deleteCache(require.resolve("../_storage/_config/boot.json"));
    deleteCache(require.resolve("../_storage/_config/config.json"));
    deleteCache(require.resolve("./eventsManager.js"));
    deleteCache(require.resolve("./commandsManager.js"));
    deleteCache(require.resolve("../_storage/_config/emojis.json"));
    
  }
}