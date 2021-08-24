function checkPing(ping) {
    if (ping < 150) return "excellent";
    else if (ping < 250) return "correcte";
    else if (ping < 400) return "médiocre";
    else if (ping < 1000) return "limite";
    else return "horrible !";
}

module.exports = {
  exe: async function(message, prefix, command, args, lang){
    let i = Date.now();
    await message.channel.send({ embeds: [{ color: "#2c2f33", title: "Récupération de données..."}] }).then((msg) => { msg.delete() })
    i = Date.now() - i
    let embed = JSON.parse(JSON.stringify(lang.assets)); embed.embeds[0].thumbnail.url = client.user.displayAvatarURL({ size: 2048, format: "png" }); embed.embeds[0].fields[0].value  = embed.embeds[0].fields[0].value.replace(/{i}/, i).replace(/{ICheckPing}/, checkPing(i)); embed.embeds[0].fields[1].value  = embed.embeds[0].fields[1].value.replace(/{ping}/, client.ws.ping).replace(/{PingCheckPing}/, checkPing(client.ws.ping))
    message.reply(embed);
  },
  interaction: async function(interaction, lang){
    let embed = JSON.parse(JSON.stringify(lang.assets)); embed.embeds[0].thumbnail.url = client.user.displayAvatarURL({ size: 2048, format: "png" }); embed.embeds[0].fields.splice(0,1); embed.embeds[0].description = "**"+embed.embeds[0].fields[0].name+"**\n"+embed.embeds[0].fields[0].value.replace(/{ping}/, client.ws.ping).replace(/{PingCheckPing}/, checkPing(client.ws.ping)); delete embed.embeds[0].fields;
    interaction.reply(embed);
  },
  config: { name: "ping", aliases: [], category: "info", system: { perms: ["SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS"], delInvoke: false, inProgress: false, staffCommand: false, devCommand: false } },
  path: null
}