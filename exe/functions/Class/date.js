function getDate(date, format) {
    if (!date || !format) return null;
    const dateObj = new Date(date - (24 * 60 * 60 * 1000));
    const times = { "YYYY": dateObj.getFullYear(), "MM": dateObj.getMonth() + 1, "DD": dateObj.getUTCDate() + 1, "hh": dateObj.getHours(), "mm": dateObj.getMinutes(), "ss": dateObj.getSeconds(), "ms": dateObj.getMilliseconds() };
    return format.replace(/\[(YYYY|MM|DD|hh|mm|ss|ms)\]/g, (_, m) => times[m].toString().padStart(2, "0"));
}

function getDifference(nb) {
    if (nb <= 1000) return "[ms]ms"; if (nb <= 1000) return "[ss]s et [ms]ms"; if (nb <= 60000) return "[mm]m, [ss]s et [ms]ms"; if (nb <= 3600000) return "[hh]h, [mm]m, [ss]s et [ms]ms"; else return "[DD] jours, [hh]h, [mm]m, [ss]s et [ms]ms";
}

function getDuration(date1) {
    if (!date1) return null;
    const date2 = Date.now()
    let format = getDifference(Math.abs(date1 - date2))
    if (!date1 || !date2 || !format) throw new Error("Arguments needed")
    let distance = Math.abs(date1 - date2);
    if (format.match("[DD]")) { var day = Math.floor(distance / 86400000); distance -= day * 86400000; }
    if (format.match("[hh]")) { var hours = Math.floor(distance / 3600000); distance -= hours * 3600000; }
    if (format.match("[mm]")) { var minutes = Math.floor(distance / 60000); distance -= minutes * 60000; }
    if (format.match("[ss]")) { var seconds = Math.floor(distance / 1000); distance -= seconds * 1000 };
    if (format.match("[ms]")) { var millisecondes = Math.floor(distance); }
    return format.replace(/\[(DD|hh|mm|ss|ms)\]/g, (_, m) => { switch (m) {
        case "DD": return day;
        case "hh": return hours;
        case "mm": return ("0" + minutes).slice(-2);
        case "ss": return ("0" + seconds).slice(-2);
        case "ms":  return ("00" + millisecondes).slice(-3); 
    }})
}

module.exports = class Date {
    constructor(date) {
        this.date = getDate(date, "[DD]/[MM]/[YYYY] à [hh]:[mm] et [ss]:[ms]");
        this.durationToNow = getDuration(date);
    }
}