const charsLines = ({
    a: ["       ", "  __ _ ", " / _` |", "| (_| |", " \\__,_|", "       "],
    b: [" _     ", "| |__  ", "| '_ \\ ", "| |_) |", "|_.__/ ", "       "],
    c: ["      ", "  ___ ", " / __|", "|  (_ ", " \\___|", "      "],
    d: ["     _ ", "  __| |", " / _` |", "| (_| |", " \\__,_|", "       "],
    e: ["      ", "  ___ ", " / _ \\", "|  __/", " \\___|", "      "],
    f: ["  __ ", " / _|", "| |_ ", "|  _|", "|_|  ", "     "],
    g: ["       ", "  __ _ ", " / _` |", "| (_| |", " \\__, |", " |___/ "],
    h: [" _     ", "| |__  ", "| '_ \\ ", "| | | |", "|_| |_|", "       "],
    i: [" _ ", "(_)", "| |", "| |", "|_|", "   "],
    j: ["   _ ", "  (_)", "  | |", "  | |", " _/ |", "|__/ "],
    k: [" _    ", "| | __", "| |/ /", "|   < ", "|_|\\_\\", "      "],
    l: [" _ ", "| |", "| |", "| |", "|_|", "   "],
    m: ["           ", " _ __ ___  ", "| '_ ` _ \\ ", "| | | | | |", "|_| |_| |_|", "           "],
    n: ["       ", " _ __  ", "| '_ \\ ", "| | | |", "|_| |_|", "       "],
    o: ["       ", "  ___  ", " / _ \\ ", "| (_) |", " \\___/ ", "       "],
    p: ["       ", " _ __  ", "| '_ \\ ", "| |_) |", "| .__/ ", "|_|    "],
    q: ["       ", "  __ _ ", " / _` |", "| (_| |", " \\__, |", "    |_|"],
    r: ["      ", " _ __ ", "| '__|", "| |   ", "|_|   ", "      "],
    s: ["     ", " ___ ", "/ __|", "\\__ \\", "|___/", "     "],
    t: [" _   ", "| |_ ", "| __|", "| |_ ", " \\__|", "     "],
    u: ["       ", " _   _ ", "| | | |", "| |_| |", " \\__,_|", "       "],
    v: ["       ", "__   __", "\\ \\ / /", " \\ V / ", "  \\_/  ", "       "],
    w: ["          ", "__      __", "\\ \\ /\\ / /", " \\ V  V / ", "  \\_/\\_/  ", "          "],
    x: ["      ", "__  __", "\\ \\/ /", " >  < ", "/_/\\_\\", "      "],
    y: ["       ", " _   _ ", "| | | |", "| |_| |", " \\__, /", " |___/ "],
    z: ["     ", " ____", "|_  /", " / / ", "/___|", "     "],
    A: ["    _    ", "   / \\   ", "  / _ \\  ", " / ___ \\ ", "/_/   \\_\\", "         "],
    B: [" ____  ", "| __ ) ", "|  _ \\ ", "| |_) |", "|____/ ", "       "],
    C: ["  ____ ", " / ___|", "| |    ", "| |___ ", " \\____|", "       "],
    D: [" ____  ", "|  _ \\ ", "| | | |", "| |_| |", "|____/ ", "       "],
    E: [" _____ ", "| ____|", "|  _|  ", "| |___ ", "|_____|", "       "],
    F: [" _____ ", "|  ___|", "| |_   ", "|  _|  ", "|_|    ", "       "],
    G: ["  ____ ", " / ___|", "| |  _ ", "| |_| |", " \\____|", "       "],
    H: [" _   _ ", "| | | |", "| |_| |", "|  _  |", "|_| |_|", "       "],
    I: [" ___ ", "|_ _|", " | | ", " | | ", "|___|", "     "],
    J: ["     _ ", "    | |", " _  | |", "| |_| |", " \\___/ ", "       "],
    K: [" _  __", "| |/ /", "| ' / ", "| . \\ ", "|_|\\_\\", "      "],
    L: [" _     ", "| |    ", "| |    ", "| |___ ", "|_____|", "       "],
    M: [" __  __ ", "|  \\/  |", "| |\\/| |", "| |  | |", "|_|  |_|", "        "],
    N: [" _   _ ", "| \\ | |", "|  \\| |", "| |\\  |", "|_| \\_|", "       "],
    O: ["  ___  ", " / _ \\ ", "| | | |", "| |_| |", " \\___/ ", "       "],
    P: [" ____  ", "|  _ \\ ", "| |_) |", "|  __/ ", "|_|    ", "       "],
    Q: ["  ___  ", " / _ \\ ", "| | | |", "| |_| |", " \\__\\_\\", "       "],
    R: [" ____  ", "|  _ \\ ", "| |_) |", "|  _ < ", "|_| \\_\\", "       "],
    S: [" ____  ", "/ ___| ", "\\___ \\ ", " ___) |", "|____/ ", "       "],
    T: [" _____ ", "|_   _|", "  | |  ", "  | |  ", "  |_|  ", "       "],
    U: [" _   _ ", "| | | |", "| | | |", "| |_| |", " \\___/ ", "       "],
    V: ["__     __", "\\ \\   / /", " \\ \\ / / ", "  \\ V /  ", "   \\_/   ", "         "],
    W: ["__        __", "\\ \\      / /", " \\ \\ /\\ / / ", "  \\ V  V /  ", "   \\_/\\_/   ", "            "],
    X: ["__  __", "\\ \\/ /", " \\  / ", " /  \\ ", "/_/\\_\\", "      "],
    Y: ["__   __", "\\ \\ / /", " \\ V / ", "  | |  ", "  |_|  ", "       "],
    Z: [" _____", "/__  /", "  / / ", " / /_ ", "/____|", "      "],
    0: ["  ___  ", " / _ \\ ", "| | | |", "| |_| |", " \\___/ ", "       "],
    1: ["  __ ", " /_ |", "  | |", "  | |", "  |_|", "    "],
    2: [" ____  ", "|___ \\ ", "  __) |", " / __/ ", "|_____|", "       "],
    3: [" _____ ", "|___ / ", "  |_ \\ ", " ___) |", "|____/ ", "       "],
    4: [" _  _   ", "| || |  ", "| || |_ ", "|__   _|", "   |_|  ", "        "],
    5: [" ____  ", "| ___| ", "|___ \\ ", " ___) |", "|____/ ", "       "],
    6: ["  __   ", " / /_  ", "| '_ \\ ", "| (_) |", " \\___/ ", "       "],
    7: [" _____ ", "|___  |", "   / / ", "  / /  ", " /_/   ", "       "],
    8: ["  ___  ", " ( _ ) ", " / _ \\ ", "| (_) |", " \\___/ ", "       "],
    9: ["  ___  ", " / _ \\ ", "| (_) |", " \\__, |", "   /_/ ", "       "],
    " ": ["    ", "    ", "    ", "    ", "    ", "    "],
    ".": ["     ", "     ", "     ", "  _  ", " (_) ", "     "],
    "-": ["       ", "       ", " _____ ", "|_____|", "       ", "       "],
    "_": ["       ", "       ", "       ", "       ", " _____ ", "|_____|"],
    "/": ["    __", "   / /", "  / / ", " / /  ", "/_/   ", "      "],
    "\\": ["__    ", "\\ \\   ", " \\ \\  ", "  \\ \\ ", "   \\_\\", "      "],
    ":": ["     ", "  _  ", " (_) ", "  _  ", " (_) ", "     "],
    ",": ["     ", "     ", "     ", "  _  ", " ( ) ", " |/  "],
    ";": ["     ", "  _  ", " (_) ", "  _  ", " ( ) ", " |/  "],
    "!": [" _ ", "| |", "| |", "|_|", "(_)", "   "],
    "?": [" ___ ", "|__ \\", " / / ", " |_| ", " (_) ", "     "],
    "|": [" _ ", "| |", "| |", "| |", "| |", "|_|"],
    "&": ["  ___   ", " ( _ )  ", " / _ \\/\\", "| (_>  <", " \\___/\\/", "        "],
    "*": [" \\|/", " /|\\", "    ", "    ", "    ", "    "],
    "[": [" __ ", "| _|", "| | ", "| | ", "| | ", "|__|"],
    "]": [" __ ", "|_ |", " | |", " | |", " | |", "|__|"],
    "(": ["  __", " / /", "| | ", "| | ", "| | ", " \\_\\"],
    ")": ["__  ", " \\ \\", " | |", " | |", " | |", "/_/ "],
    "{": ["   __", "  / /", " | | ", "< <  ", " | | ", "  \\_\\"],
    "}": ["__   ", "  \\ \\", " | | ", " > > ", " | | ", "/_/  "],
    "+": ["       ", "   _   ", " _| |_ ", "|_   _|", "  |_|  ", "       "],
    "°": [" __ ", "/__\\", "\\__/", "    ", "    ", "    "],
    "%": [" _  __", "(_)/ /", "  / / ", " / /_ ", "/_/(_)", "      "],
    ù: ["  __   ", " _\\_\\_ ", "| | | |", "| |_| |", " \\__,_|", "       "],
    é: ["   __ ", "  /_/ ", " / _ \\", "|  __/", " \\___|", "      "],
    è: ["  __  ", "  \\_\\ ", " / _ \\", "|  __/", " \\___|", "      "],
    à: ["  __   ", "  \\_\\_ ", " / _` |", "| (_| |", " \\__,_|", "       "],
    È: ["  __   ", " _\\_\\_ ", "| ____|", "|  _|_ ", "|_____|", "       "],
    À: ["  __   ", "  \\_\\  ", "  /_\\  ", " / _ \\ ", "/_/ \\_\\", "       "],
    Ù: ["  __   ", " _\__\\_ ", "| | | |", "| _ | |", " \\___/ ", "       "],
    $: ["  _  ", " | | ", "/ __)", "\\__ \\", "(   /", " |_| "],
    "£": ["   ___  ", "  / ,_\\ ", "_| |_   ", " | |___ ", "(_,____|", "        "],
    "§": ["   __  ", " _/ _) ", "/  _ \\ ", "\\ \\_\\ \\", " \\  __/", "(__/   "],
    "¤ ": ["/\\___/\\", "\\  _  /", "| (_) |", "/ ___ \\", "\\/   \\/", "       "],
    "µ": ["       ", " _   _ ", "| | | |", "| |_| |", "| ._,_|", "|_|    "],
    "#": ["   _  _   ", " _| || |_ ", "|_  __  _|", "|_  ‾‾  _|", "  |_||_|  ", "          "],
    "~": ["      ", "      ", " /‾\\/‾|", "|_/\\_/", "      ", "      "],
    "'": ["  _ ", " ( )", " |/ ", "    ", "    ", "    "],
    '"': ["  _ _ ", " ( | )", "  V V ", "      ", "      ", "      "],
    "`": ["  _ ", " ( )", "  \\|", "    ", "    ", "    "],
    "¨": [" _  _ ", "(_)(_)", "      ", "      ", "      ", "      "],
    "^": [" /‾‾\\ ", "|_/\\_|", "      ", "      ", "      ", "      "],
    "@": ["   ____  ", "  / __ \\ ", " / / _` |", "| | (_| |", " \\ \\__,_|", "  \\____/ "],
    ç: ["      ", "  ___ ", " / __|", "| (__ ", " \\___|", "  )_) "],
    "²": [" ___ ", "|_  )", " / / ", "/___|", "     ", "     "],
    "€": ["    ___", "   / __|", " _| |__ ", " _| |__ ", "  | |__ ", "   \___|"]
})
const Discord = require("discord.js")

function chunk(arr, n) { return (arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : []); };

module.exports = [
    Array.prototype.splitArray = function(n) {
        if (typeof this !== "object" || typeof n !== "number") throw new Error(typeof this !== "object" ? "This prototype is only for Array" : "The arguments for separation must be a number") 
        return (this.length <= n ? this : chunk(this, n))
    },
    String.prototype.toASCII = function() {
        const res = ['', '', '', '', '', ''],
        copy = this.split('').filter(c => charsLines[c])
        for (let e = 0; e < copy.length; e++) charsLines[copy[e]].forEach((l, i) => res[i] = res[i].slice(0, res[i].length - ([" ", "_"].some(char => res[i].endsWith(char)) && !l.startsWith(" ") ? 1 : 0)) + l.slice([" ", "_"].some(char => res[i].endsWith(char)) && !l.startsWith(" ") || e == 0 ? 0 : 1))
        return res
    }, 
    Number.prototype.shortNumber = function() {
        const tab = ['y', 'z', 'e', 'p', 't', 'g', 'm', 'k']
        for (let i = 24, y = 0; i > 0; i -= 3, y++) if (this >= 10 ** i) return (this / 10 ** i).toFixed((this / 10 ** i).toFixed(1).toString().includes('.0') ? 0 : 1) + tab[y].toUpperCase()
        return this
    },
    Discord.RoleManager.prototype.selectRole = function(args, options = { fetch: false }){
        if (!args || typeof options !== "object" || Array.isArray(options) || !(this instanceof Discord.RoleManager) ) throw new Error("Invalids arguments was provided !");
        if (options.fetch) return this.cache.find(e => e.id == args || e.name.toLowerCase().match(new RegExp(args, "g")) ) || ( client.guilds.cache.some(g => g.roles.cache.find(e => e.id == args || e.name.toLowerCase().match(new RegExp(args, "g")) )) ? client.guilds.cache.find(g => g.roles.cache.find(e => e.id == args || e.name.toLowerCase().match(new RegExp(args, "g")) )).roles.cache.find(e => e.id == args || e.name.toLowerCase().match(new RegExp(args, "g")) ) : undefined );
        else return this.cache.find(e => e.id == args || e.name.toLowerCase().match(new RegExp(args, "g")) );
    },
    Discord.GuildMemberManager.prototype.selectMember = function (args, options = { fetch: false, bot: false }) {
        if (!args || typeof args !== "string" || typeof options !== "object" || Array.isArray(options) || !(this instanceof Discord.GuildMemberManager) ) throw new Error("Invalids arguments was provided !");
        if (options.fetch) return (this.cache.find(user => (options.bot ? true : user.user.bot) && ( user.id == args.replace(/\D+/g, '') || user.user.username.toLowerCase().match(args.toLowerCase()) || user.displayName.toLowerCase().match(args.toLowerCase()) ) )) || client.users.fetch(args).catch(() => null);
        else return this.cache.find(user => (options.bot ? true : !user.user.bot) && ( user.id == args.replace(/\D+/g, '') || user.user.username.toLowerCase().match(args.toLowerCase()) || user.displayName.toLowerCase().match(args.toLowerCase()) ) );
    },
    Discord.GuildChannelManager.prototype.selectChannel = function(args, options = { type: "GUILD_TEXT", fetch: false }){
        if (!args || typeof options !== "object" || Array.isArray(options) || !(this instanceof Discord.GuildChannelManager) ) throw new Error("Invalids arguments was provided !");
        if (options.fetch) return this.cache.filter(e => e.type == options.type).find(e => e.name.toLowerCase().match(new RegExp(args, "g")) || e.id == args || e.position == args || e.rawPosition == args) || client.channels.cache.filter(e => e.type == options.type).find(e => e.name.toLowerCase().match(new RegExp(args, "g")) || e.id == args || e.position == args || e.rawPosition == args);
        else return this.cache.filter(e => e.type == options.type).find(e => e.name.toLowerCase().match(new RegExp(args, "g")) || e.id == args || e.position == args || e.rawPosition == args);
    },
    Discord.Message.prototype.selectMessage = async function(args, options = { channel: false }){
        if (!args || typeof options !== "object" || Array.isArray(options) || !(this instanceof Discord.Message) ) throw new Error("Invalids arguments was provided !");
        const chl = options.channel ? client.channels.cache.get(options.channel) : null;
        if (options.channel) return ( await this.channel.messages.fetch(args).catch(() => false)) || (chl ? await chl.messages.fetch(args).catch(() => null) : null);
        else return this.channel.messages.fetch(args).catch(() => null);
    },
]