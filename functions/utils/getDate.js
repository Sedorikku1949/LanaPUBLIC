module.exports = function(date, format){
    const dateObj = new Date(date - (24 * 60 * 60 * 1000));
    const times = { "YYYY": dateObj.getFullYear(), "MM": dateObj.getMonth() + 1, "DD": dateObj.getUTCDate() + 1, "hh": dateObj.getHours(), "mm": dateObj.getMinutes(), "ss": dateObj.getSeconds(), "ms": dateObj.getMilliseconds() };
    return format.replace(/\[(YYYY|MM|DD|hh|mm|ss|ms)\]/g, (_, m) => times[m].toString().padStart(2, "0"));
}