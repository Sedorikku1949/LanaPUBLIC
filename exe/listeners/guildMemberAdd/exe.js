module.exports = async function(member){
  if (member.guild.id == "892743705834954772") {
    member.roles.add("892743907723579412").catch(() => false)
  }
}