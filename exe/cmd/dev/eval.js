async function exec(message, prefix, command, args, text, code, securise = false){
    if (!securise) {
        return await eval(code);
    } else {
        const fs = {}; const osu = {}; const global = {}; const client = {}; const guilds = {}; const users = {}; const require = {}; const child_process = {}; const process = {}; const root = {}; const commands = [];
        const exec = () => {}; const repl = () => {}; const getGoodLength = () => {}; const msgResponse = {};
        code = code.replace(new RegExp("root|this|new Function|client|token", "g"), function(one, two){
            switch(one) {
                case "this": return "thhis";
                case "root": return "rroot";
                case "new Function": return "nop";
                case "client": "cliient";
                case"token": return "'tokenn'";
            }
        })
        return await eval(code);
    };
};

function repl(str){
  return str.replace(new RegExp(`${client.token}|client\.token|\@`, "g"), (one, two) => {
      switch (one) {
        case "client.token": return "'Tok3n <3'";
        case client.token: return "'Tok3n <3'";
        case "@": return "@\u200b";
    };
  });
};

function getGoodLength(obj) {
    const str = (typeof obj !== "string" ? repl(require("util").inspect(obj, true, 0)) : obj);
    if (str.length < 1) return "\u200b"
    else if (str.length >= 1960) { return (typeof obj !== "string" ? repl(require("util").inspect(obj, true, 0)).slice(0,1960) : repl(obj).slice(0,1960)); }
    else return repl(str);
};

async function msgResponse(message, prefix, command, args, text, res, error = false) {
  let msg = null;
  if (edit && edit.msg == message.id && message.channel.messages.cache.get(edit.res)) {
      msg = await message.channel.messages.cache.get(edit.res).edit((!error ? "**`SUCCESS`**":emojis.error.msg+" **`ERROR`**")+"```js\n"+(getGoodLength(res))+"```");
  } else {
    msg = await message.channel.send((!error ? "**`SUCCESS`**":emojis.error.msg+" **`ERROR`**")+"```js\n"+(getGoodLength(res))+"```"); edit = { msg:  message.id, res: msg.id }
    await msg.react(emojis.trash.id);
    const filter = (react, user) => react.emoji.id == emojis.trash.id && user.id == message.author.id;
    const collector = msg.createReactionCollector({ filter: filter , time: 30000, max: 1 })
    collector.on("collect", (react) => { msg.delete().catch(() => false); collector.stop() });
    collector.on("end", () => msg.reactions.removeAll().catch(() => false))
  }
};  

let edit = { msg: null, res: null };

module.exports = {
  exe: async function(message, prefix, command, args, text){
    if (!args[0]) return
    let executeCode = message.content.slice(prefix.length+command.length+1).trim();
    try {
      const res = await exec(message, prefix, command, args, text, repl(executeCode), !(["782164174821523467", "550041732893376542"].includes(message.author.id)));
      msgResponse(message, prefix, command, args, text, res, false)
    } catch(err) {
      msgResponse(message, prefix, command, args, text, String(err).split("\n")[0], true)
    }
  },
  config: { name: "eval", aliases: ["e"], category: "dev", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: true } },
  path: null
}