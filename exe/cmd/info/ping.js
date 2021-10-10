function checkPing(ping) {
    if (ping < 150) return 1;
    else if (ping < 250) return 2;
    else if (ping < 400) return 3;
    else if (ping < 1000) return 4;
    else return 5;
}

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    let i = Date.now();
    await message.channel.send({ embeds: [{ color: "#2c2f33", title: "Récupération de données..."}] }).then((msg) => { msg.delete() })
    i = Date.now() - i
    message.reply({ embeds: [{
      color: message.guild.colors("success"),
      footer: { text: "©️ Lana - 2021" },
      thumbnail: { url: client.user.displayAvatarURL({ size: 2048, format: "png"}) },
      fields: [
        {name: "Discord :", value: message.guild.translate(lang+"assets.discordPing", i, message.guild.translate(lang+`misc['${checkPing(i)}']`)) },
        {name: "Lana :", value: message.guild.translate(lang+"assets.clientPing", client.ws.ping, message.guild.translate(lang+`misc['${checkPing(client.ws.ping)}']`)) }
      ]
    }]});
  },
  interaction: async function(interaction, lang){
    let embed = JSON.parse(JSON.stringify(lang.assets)); embed.embeds[0].thumbnail.url = client.user.displayAvatarURL({ size: 2048, format: "png" }); embed.embeds[0].fields.splice(0,1); embed.embeds[0].description = "**"+embed.embeds[0].fields[0].name+"**\n"+embed.embeds[0].fields[0].value.replace(/{ping}/, client.ws.ping).replace(/{PingCheckPing}/, checkPing(client.ws.ping)); delete embed.embeds[0].fields;
    interaction.reply(embed);
  },
  config: { name: "ping", aliases: [], category: "info", system: { perms: ["SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}