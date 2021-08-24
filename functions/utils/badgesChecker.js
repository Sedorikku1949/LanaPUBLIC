module.exports = async function(message){
  // is in the support
  const badges = (await database.db.get("user/"+message.author.id))?.profile?.badges;
  if (!badges) return;
  if (client.guilds.cache.get("870372725376548964")?.members.cache.get(message.author.id) && !badges.includes("IS_IN_SUPPORT_GUILD")) { await database.db.push("user/"+message.author.id, "IS_IN_SUPPORT_GUILD", "profile.badges"); };
  if (client.guilds.cache.some(e => e.ownerId == message.author.id) && !badges.includes("HAVE_INVITED_CLIENT")) { await database.db.push("user/"+message.author.id, "HAVE_INVITED_CLIENT", "profile.badges"); };

}