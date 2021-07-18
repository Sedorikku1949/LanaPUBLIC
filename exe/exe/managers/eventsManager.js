const fs = require("fs")
const Discord = require("discord.js")
require('discord-reply');
const disbut = require('discord-buttons')

async function wait(ms) {
    return new Promise((resolve, _) => { setTimeout(() => resolve(true), ms) })
}

async function execute() {
    await wait(1000)

    // reload gestion
    if (!global["config"]) (global["config"] = require("../_storage/_config/config.json"))
    if (global["interval"] && global["interval"].length > 0) {
        global["interval"].forEach(e => { clearInterval(e) })
        delete global["interval"]
    }
    if (!global["interval"]) global["interval"] = []
    if (config.reload) {
        global["client"].destroy()
        delete global["client"]
    }

    // lancement/reload
    global["client"] = new Discord.Client()
    disbut(global["client"])
    global["start"] = Date.now()
    
    client.prefix = require("../_storage/_config/boot.json").prefix

    // event loader
    let error = []
    let i = 0;

    fs.readdirSync("exe/listeners").forEach((dir) => {
        if (dir.match(/\./g)) return console.log(`{yellow}{ WARNING }  >>  The file "exe/listeners/${dir}" has been ignored by the event loader`)
        if (!fs.existsSync(`exe/listeners/${dir}/exe.js`)) return console.log(`{red}{ ERROR }  >>  The folder "exe/listeners/${dir}" doesn't have a file named "exe.js"`)
        try { const m = Date.now(); client.on(dir, require(`../listeners/${dir}/exe.js`)); deleteCache(require.resolve(`../listeners/${dir}/exe.js`)) ; console.log(`{blue}{ EVENTS }  >> The event "exe/listeners/${dir}" has been successfully loaded at exe/listeners/${dir}/exe.js" in ${Date.now() - m}ms`); i++ } catch(err) { console.log(`{red}{ EVENT ERROR }  >>  An error as occured when loading "exe/listeners/${dir}/exe.js""`); error.push({file: `dir/exe.js`, error: err}) }
    })
    console.log(`{green}${i} event(s) has been successfully loaded`)

    global["commands"] = require("./commandsManager").init()

    // bdd
    const Enmap = require(NODE+"enmap")
    global["users"] = new Enmap({ dataDir: "exe/_storage/users/", name: "users" })
    global["guilds"] = new Enmap({ dataDir: "exe/_storage/guilds", name: "guilds" })
    console.log("{green}The database has been successfully loaded")

    // languages
    global["language"] = {}
    fs.readdirSync("exe/_storage/_langs").forEach( (dir) => {
        try { language[dir.replace(/\.json/g, "")] = require(`../_storage/_langs/${dir}`) ; deleteCache(require.resolve(`../_storage/_langs/${dir}`)) }
            catch(err) { console.log(`{red}`) }
    })
    console.log(`{green}${Object.keys(language).length} languages files has been successfully loaded !`)

    // login
    client.login(require("../_storage/_config/boot.json").token)

    // reload msg
    if (config.reload && config.reload.msg && config.reload.channel) {
        await wait(1000)
        await client.channels.cache.get(config.reload.channel).messages.fetch(config.reload.msg).then(async(msg) => {
            await msg.edit({ embed: { color: "#5865F2", description: `${config.emojis.powerbutton.msg} **J'ai redémarré avec succès !**` } })
        });
        config.reload = false
    }

    deleteCache(require.resolve("../_storage/_config/boot.json"));
    deleteCache(require.resolve("../_storage/_config/config.json"));
    deleteCache(require.resolve("./eventsManager.js"));
    deleteCache(require.resolve("./commandsManager.js"));
}

execute()