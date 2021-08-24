module.exports = async function(interaction){
  if (interaction.isCommand()) {
    const lang = Object.assign({}, (database.db.get("user/"+interaction.user.id) ? (database.language[database.db.get("user/"+interaction.user.id).lang] || database.language.fr) : database.language.fr ));

    if (interaction.commandName == "ping") return database.commands.find(e => e.config.name == "ping")?.interaction(interaction, lang.commands[interaction.commandName]);
    if (interaction.commandName == "invite") return database.commands.find(e => e.config.name == "invite")?.interaction(interaction, lang.commands[interaction.commandName]);
    if (interaction.commandName == "help") return database.commands.find(e => e.config.name == "help")?.interaction(interaction, lang.commands[interaction.commandName]);
    if (interaction.commandName == "support") return database.commands.find(e => e.config.name == "support")?.interaction(interaction, lang.commands[interaction.commandName]);
  }
}