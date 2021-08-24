function calculate(str){
  const calc = (str.split("").filter(e => e.match(/[0-9]|\+|\-|\%|\÷|\×|\x|\/|\*|\(|\)|\[|\]/g)).join("")).replace(/\x|\×/g, "*").replace(/\÷/g, "/");
  let res = false; try { res = eval(calc) || "ERROR" } catch (err) { res = "ERROR" };
  return res;
};

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    if (!args[0]) return message.reply(lang.assets.noArgs);
    message.reply(lang.assets.response.replace(/{calc}/g, calculate(message.content.slice(prefix.length+command.length+1))))
  },
  config: { name: "calculator", aliases: ["calculate", "calc", "calcul"], category: "utility", system: { perms: ["SEND_MESSAGES"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}