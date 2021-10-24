const Discord = require("discord.js");

module.exports = async function(interaction){
  // slash commands
  if (interaction.isCommand()) {
    const lang = Object.assign({}, (database.db.get("user/"+interaction.user.id) ? (database.language[database.db.get("user/"+interaction.user.id).lang] || database.language.fr) : database.language.fr ));

    if ((await database.db.get("blacklist")).some(e => e.id == interaction.user.id)) return interaction.reply(lang.misc.blacklistedUser);
    const cmd = database.commands.find(e => typeof e.interaction == "function" && e.config.name == interaction.commandName);
    if (!cmd) return interaction.reply("❌ **An error as occured !**");
    try {
      console.log(`{blue}{ INTERACTION_COMMAND } >> "${interaction.user?.username ?? interaction.user?.id}"" as utiliser la commande "${cmd.config.name}" dans #${interaction.channel?.name}`)
      cmd.interaction(interaction, cmd.lang ?? "commands")
    } catch(err) {
      console.log(err);
      interaction.reply("❌ **An error as occured !**");
    }
  }


  // select Menu
  if (interaction.isSelectMenu()){
    if (interaction.customId == 'language'){
      if (!interaction.member || !interaction.guild || !(interaction.guild instanceof Discord.Guild) || !interaction.member.isStaff() ) return;
      if (database.db.get("guild/"+interaction.guild.id).lang == interaction.values) return interaction.reply({ content: interaction.guild.translate("languageAlreadySelected"), ephemeral: true })
      await database.db.set("guild/"+interaction.guild.id, interaction.values[0], "lang")
      interaction.reply({ content: interaction.guild.translate("newLanguageSelected"), ephemeral: true });
    }
  }

  // Button
  if (interaction.isButton()){
    if (interaction.customId == "HELP_BUTTON"){
      interaction.reply({
        embeds: [{
          color: interaction.guild.colors("embed"),
          title: interaction.guild.translate("#misc.buttonHelp.title"),
          fields: interaction.guild.translate("#misc.buttonHelp.fields")
        }],
        ephemeral: true
      })
    }
  }
}