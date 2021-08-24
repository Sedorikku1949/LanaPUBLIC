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

function getSaison() {
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

module.exports = async function(){
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

    global["interval"].push(interval)
}