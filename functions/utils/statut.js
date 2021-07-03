const list = [
    "eMange une glace sur sa terasse"
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