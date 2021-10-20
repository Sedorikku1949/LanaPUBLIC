const Discord = require("discord.js");

module.exports = async function(interaction){
  // slash commands
  if (interaction.isCommand()) {
    const lang = Object.assign({}, (database.db.get("user/"+interaction.user.id) ? (database.language[database.db.get("user/"+interaction.user.id).lang] || database.language.fr) : database.language.fr ));

    if ((await database.db.get("blacklist")).some(e => e.id == interaction.user.id)) return interaction.reply(lang.misc.blacklistedUser);
    if (interaction.commandName == "ping") return database.commands.find(e => e.config.name == "ping")?.interaction(interaction, database.commands.find(e => e.config.name == "ping")?.lang ?? "commands");
    if (interaction.commandName == "invite") return database.commands.find(e => e.config.name == "invite")?.interaction(interaction, database.commands.find(e => e.config.name == "invite")?.lang ?? "commands");
    if (interaction.commandName == "help") return database.commands.find(e => e.config.name == "help")?.interaction(interaction, database.commands.find(e => e.config.name == "help")?.lang ?? "commands");
    if (interaction.commandName == "support") return database.commands.find(e => e.config.name == "support")?.interaction(interaction, database.commands.find(e => e.config.name == "support")?.lang ?? "commands");
  }


  // select Menu
  if (interaction.isSelectMenu()){
    if (interaction.customId == 'language'){
      if (!interaction.member || !interaction.guild || !(interaction.guild instanceof Discord.Guild) || !interaction.member.isStaff() ) return;
      if (database.db.get("guild/"+interaction.guild.id).lang == interaction.values) return interaction.reply({ content: interaction.guild.translate("languageAlreadySelected"), ephemeral: true })
      await database.db.set("guild/"+interaction.guild.id, interaction.values, "lang")
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