const nodeHtmlToImage = require("node-html-to-image")

module.exports = {
  exe: async function (message, prefix, command, args, text) {
    const images = await nodeHtmlToImage({
      html: '<html><body><script type="text/javascript">function script(){const canvas = document.querySelector(".test"); console.log(document.querySelector("test")); const ctx = document.querySelector(".test").getContext("2d"); ctx.fillStyle = "rgb(0,0,0)"; ctx.fillRect(0, 0, canvas.width, canvas.height)}; window.onload = script</script><center><canvas width="700" height="600" class="test">test</canvas></center></body></html>',
    })


    message.channel.send({ content: "test", files: [{ name: "test.png", attachment: images }] })
  },
  config: {
    name: "test",
    aliases: ["t"],
    category: "dev",
    options: [["args"], []],
    help: { desc: "...", use: "..." },
    system: {
      perms: ["SEND_MESSAGES"],
      delInvoke: false,
      inProgress: false,
      staffCommand: false,
      devCommand: true,
    },
  },
  path: null,
};
