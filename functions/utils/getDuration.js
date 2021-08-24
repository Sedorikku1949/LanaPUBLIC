module.exports = function(date1, date2, format){
    if (!date1 || !date2 || !format) throw new Error("Arguments needed")
    let distance = Math.abs(date1 - date2);
    if (format.match("[DD]")) { var day = Math.floor(distance / 86400000); distance -= day * 86400000; }
    if (format.match("[hh]")) { var hours = Math.floor(distance / 3600000); distance -= hours * 3600000; }
    if (format.match("[mm]")) { var minutes = Math.floor(distance / 60000); distance -= minutes * 60000; }
    if (format.match("[ss]")) { var seconds = Math.floor(distance / 1000); distance -= seconds * 1000 };
    if (format.match("[ms]")) { var millisecondes = Math.floor(distance); }
    return format.replace(/\[(DD|hh|mm|ss|ms)\]/g, (_, m) => { switch (m) { case "DD": return day; case "hh": return hours; case "mm": return ("0" + minutes).slice(-2); case "ss": return ("0" + seconds).slice(-2); case "ms":  return ("00" + millisecondes).slice(-3);  } })
}