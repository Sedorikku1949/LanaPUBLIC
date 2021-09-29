const chartJS = require("chartjs-node-canvas")
const Discord = require("discord.js")

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    const allData = await database.db.get("system/stats");
    const today = allData[(require("dayjs"))(new Date()).format("DD-MM-YYYY")];
    if (!today) return;
    const chartCallBack = (chartJS) => {};
    const canvas = new chartJS.CanvasRenderService(width, height, chartCallBack);
    const configuration = {
      type: 'line',
      data: {
        labels: date,
        datasets: [
          {
            borderColor: '#A6D4FF',
            data: [2,3,4,8,3,7],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: 'Commandes',
        },
      },
    };

    const image = await canvas.renderToBuffer(configuration)

    const file = new Discord.MessageAttachment(image, 'a.jpg')
    message.channel.send({
      files: [file],
      embed: {
        title: "Stats :",
        image: { url: 'attachment://a.jpg' },
      },
    })
  },
  config: { name: "stats", aliases: [], category: "dev", system: { perms: ["SEND_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: true } },
  path: null
}