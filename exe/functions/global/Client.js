const Discord = require("discord.js")
const list = [
  // printemps
  "pS'il n'y avait pas d'hiver, le printemps ne serait pas si agréable : si nous ne goûtions pas à l'adversité, la réussite ne serait pas tant appréciée.",
  "pMarche dans une prairie fleuri 🌾",
  "pLa saison des amours ❤, vient passez du temps avec nous, seul ou a deux :D",
  "pObserve une rose 🥀",
  "pPleure du retour des controles à l'école",
  "pNettoie les salons, pour le nettoyage de printemps",
  "pIl n'est pas d'hiver sans neige, de printemps sans soleil, et de joie sans être partagée",

  // été
  "eEst partie en randonnée 🚶🏻‍♂️",
  "eMange une glace sur la plage 🏖️",
  "eS'ennuie",
  "eTeste de nouvelles pp pour être belle sur la plage",
  "eSaison chaude et du maillot, viens faire une baignade avec moi ;D",
  "eJe me fais mater par Kuri à la plage",
  "eMange une glace sur sa terrasse.",
  "eConcours de T-shirt mouillé !",

  // automne
  "aRamasse les feuilles mortes dans les serveurs.",
  "aLes feuilles tombent, les arbres rougeoient, je suis nostalgique, pas toi ?",
  "aAttend la neige avec impatience",
  "aEnfile une veste chaude pour aller voir ses amis",

  // hiver
  "hMange une bûche avec ses parents.",
  "hFait une bataille de boule de neige avec {user} ❄️",
  "hEssaye de marcher sur du verglas",
  "hFait de la luge avec {user} 🛷",
  "hDiscute autour du feu avec {randomUser}",
  "hDéneige devant la porte du serveur",
  "h🎶L'hiver s'installe doucement dans la nuit, la neige est reine à son tour 🎶",
  "hBrrrr... fait froid, viens prendre un chocolat avec moi :D",
  "hJe voudrais un bonhomme de neige...",
]

function getSaison(){
  const month = getDate(Date.now(), `[MM]`)
  if (3 <= month && month <= 5) return 'p';
  else if (6 <= month && month <= 8) return 'e';
  else if (9 <= month && month <= 11) return 'a';
  else return 'h';
}
function r(str) {
  if (typeof str !== "string") return str
  return str.replace(/{user}|{randomUser}/gi, (grp, _) => {
      switch(grp) {
          case "{user}": return client.guilds.cache.get("796376442866368513").members.cache.filter(e => !e.user.bot).random().user.username
          case "{randomUser}": return client.guilds.cache.get("782235567970713620").members.cache.filter(e => !e.user.bot).random().user.username
      }
  })
}

module.exports = {
  // permissions
  hasPermission: function(message, permissionNeeded){
      if ( !(message instanceof Discord.Message) || !Array.isArray(permissionNeeded)) return true;
      const clientPermissionInThisChannel = message.channel.permissionsFor(client.user.id).toArray()
      const permissionForget = permissionNeeded.filter(e => !clientPermissionInThisChannel.includes(e))
      if (permissionForget.length <= 0) return false;
      return permissionForget;
  },
  getPermissionName: function(str){
    switch(str){
      case "ADMINISTRATOR": return "Adminisrateur / ADMINISTRATOR";
      case "CREATE_INSTANT_INVITE": return "Créer des invitations instantanées / CREATE_INSTANT_INVITE";
      case "BAN_MEMBERS": return "Bannir des membres / BAN_MEMBERS";
      case "MANAGE_CHANNELS": return "Gérer les salons / MANAGE_CHANNELS";
      case "ADD_REACTIONS": return "Ajouter des réactions / ADD_REACTIONS";
      case "PRIORITY_SPEAKER": return "Etre en voix prioritaire / PRIORITY_SPEAKER";
      case "VIEW_CHANNEL": return "Voir les salons / VIEW_CHANNEL";
      case "SEND_TTS_MESSAGES": return "Envoyer des messages tts / SEND_TTS_MESSAGES";
      case "EMBED_LINKS": return "Envoyer des embeds / EMBED_LINKS";
      case "READ_MESSAGE_HISTORY": return "Lire l'historique des messages / READ_MESSAGE_HISTORY";
      case "USE_EXTERNAL_EMOJIS": return "Utiliser des emojis externes / USE_EXTERNAL_EMOJIS";
      case "CONNECT": return "Se connecter dans un salon vocal / CONNECT";
      case "MUTE_MEMBERS": return "Couper le micro des membres / MUTE_MEMBERS";
      case "MOVE_MEMBERS": return "Déplacer des membres d'un vocal / MOVE_MEMBERS";
      case "CHANGE_NICKNAME": return "Changer son surnom / CHANGE_NICKNAME";
      case "MANAGE_ROLES": return "Gérer les rôles / MANAGE_ROLES";
      case "MANAGE_EMOJIS": return "Gérer les emojis / MANAGE_EMOJIS";
      case "KICK_MEMBERS": return "Expulser des membres / KICK_MEMBERS";
      case "MANAGE_GUILD": return "Gérer le serveur / MANAGE_GUILD";
      case "VIEW_AUDIT_LOG": return "Voir les logs / VIEW_AUDIT_LOG";
      case "STREAM": return "Partager son écran / STREAM";
      case "SEND_MESSAGES": return "Envoyer des messages / SEND_MESSAGES";
      case "MANAGE_MESSAGES": return "Gérer les messages / MANAGE_MESSAGES";
      case "ATTACH_FILES": return "Envoyer des fichiers en pièces jointes / ATTACH_FILES";
      case "MENTION_EVERYONE": return "Mentionner tout le monde / MENTION_EVERYONE";
      case "VIEW_GUILD_INSIGHTS": return "Voir les statistiques du serveur / VIEW_GUILD_INSIGHTS";
      case "SPEAK": return "Parler en vocal / SPEAK";
      case "DEAFEN_MEMBERS": return "Mettre en sourdine les membres / DEAFEN_MEMBERS";
      case "USE_VAD": return "Utiliser la détection de voix en vocal / USE_VAD";
      case "MANAGE_NICKNAMES": return "Gérer les surnoms des membres / MANAGE_NICKNAMES";
      case "MANAGE_WEBHOOKS": return "Gérer les webhooks / MANAGE_WEBHOOKS";
    }
  },
  
  // kady
  statut: async function(){
      function* status(i) {
          const statut = list.filter(e => e.startsWith(getSaison())).map(e => e.slice(1)).filter(e => e !== undefined)
          yield statut[i++ % statut.length]
          yield* status(statut.findIndex(st => st == statut[i]))
      }
      const currentSt = status(1)
    
      let a = r( list.filter(e => e.startsWith(getSaison())).map(e => e.slice(1)).filter(e => e !== undefined)[0] )
      while (!a || typeof a !== "string" || a == "undefined") { a = r(list.filter(e => e.startsWith(getSaison())).map(e => e.slice(1)).filter(e => e !== undefined)[0]) }
    
      await client.user.setActivity(a, { type: "WATCHING"} )
      client.user.setActivity(a, { type: "WATCHING"})
    
      const interval = setInterval(() => {
          let statut = r(currentSt.next().value)
          while (!statut || typeof statut !== "string" || statut == "undefined") { statut = r(currentSt.next().value) }
          client.user.setActivity(statut, { type: "WATCHING"})
      }, 5*60*1000)
      database.Client.interval.push(interval)
  },
  discordbotlist: () => {
    if (client.user.id == "858766319506554899") return fetch('https://discordbotlist.com/api/v1/bots/lana/stats', {
      method: 'post',
      headers: { "Authorization": config.API.discordbotlist.token, "content-type": "application/json" },
      body: JSON.stringify({ users: client.users.cache.size, guilds: client.guilds.cache.size, shard_id: 0, voice_connections: 0 })
    });
    else return null;
  },

  // CLASS
  date: require("../Class/date.js"),
  encrypt: require("../Class/encrypt.js"),
  clientStats: require("../Class/clientStats.js"),
  progressBar: require("../Class/progressBar.js"),
  slashCommands: require("../Class/slashCommands.js"),
  cleverAPI: require("../Class/cleverAPI.js"),
}