module.exports = {
  exe: async function(message, prefix, command, args, lang){
    const allData = await database.db.get("system/stats");
    const today = allData[(require("dayjs"))(new Date()).format("DD-MM-YYYY")];
  },
  config: { name: "save", aliases: [], category: "dev", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: true } },
  path: null
}