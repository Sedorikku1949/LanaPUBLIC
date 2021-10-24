function specificGrade(cmd, title){
  if (cmd.config.system.devCommand) return `${emojis.dev.msg}** ** ** **${title}`;
  else return title;
}

module.exports = async function(msg, cmd, message, lang, prefix){
  const embed = {
    embeds: [{
      color: message.guild.colors("mainColor"),
      author: { name: client.user.tag, icon_url: client.user.displayAvatarURL({ size: 2048, format: "png" }) },
      title: specificGrade(cmd, message.guild.translate(lang+"assets.CMD_TITLE", cmd.config.name)),
      footer: { text:"© Lana - 2021" },
      fields: [
        { name: message.guild.translate(lang+"assets.CMD_FIELDS_CTG_NAME"), value: "```\n"+(message.guild.translate(`#misc.category["${cmd.config.category}"]`) ?? cmd.config.category)+"```", inline: true },
        { name: message.guild.translate(lang+"assets.CMD_FIELDS_ALIASE_NAME"), value: "```\n"+(cmd.config.aliases.length > 0 ? cmd.config.aliases.join(" / ") : message.guild.translate(lang+"misc.noAliase"))+"```", inline: true },
        { name: message.guild.translate(lang+"assets.CMD_FIELDS_DESC_NAME"), value: "```\n"+(message.guild.translate(`#commands["${cmd.config.name}"].desc`) ?? "...")+"```", inline: false },
        { name: message.guild.translate(lang+"assets.CMD_FIELDS_USE_NAME"), value:"```\n"+ (message.guild.translate(`#commands["${cmd.config.name}"].use`, prefix ?? client.prefix) ?? '...')+"```", inline: false },
      ]
    }],
    components: [...message.guild.translate(lang+"assets.CMD_COMPONENTS")]
  };
  if (!msg) message.reply(embed);
  else msg.edit(embed);
};