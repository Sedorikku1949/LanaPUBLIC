module.exports = {
  // dates
  getDate: function(date, format){
    const dateObj = new Date(date - (24 * 60 * 60 * 1000));
    const times = { "YYYY": dateObj.getFullYear(), "MM": dateObj.getMonth() + 1, "DD": dateObj.getUTCDate() + 1, "hh": dateObj.getHours(), "mm": dateObj.getMinutes(), "ss": dateObj.getSeconds(), "ms": dateObj.getMilliseconds() };
    return format.replace(/\[(YYYY|MM|DD|hh|mm|ss|ms)\]/g, (_, m) => times[m].toString().padStart(2, "0"));
  },
  getDuration: function(date1, date2, format){
    if (!date1 || !date2 || !format) throw new Error("Arguments needed")
    let distance = Math.abs(date1 - date2);
    if (format.match("[DD]")) { var day = Math.floor(distance / 86400000); distance -= day * 86400000; }
    if (format.match("[hh]")) { var hours = Math.floor(distance / 3600000); distance -= hours * 3600000; }
    if (format.match("[mm]")) { var minutes = Math.floor(distance / 60000); distance -= minutes * 60000; }
    if (format.match("[ss]")) { var seconds = Math.floor(distance / 1000); distance -= seconds * 1000 };
    if (format.match("[ms]")) { var millisecondes = Math.floor(distance); }
    return format.replace(/\[(DD|hh|mm|ss|ms)\]/g, (_, m) => { switch (m) { case "DD": return day; case "hh": return hours; case "mm": return ("0" + minutes).slice(-2); case "ss": return ("0" + seconds).slice(-2); case "ms":  return ("00" + millisecondes).slice(-3);  } })
},
  // page moves
  increase: function increase(x, embed) { return x >= embed.length - 1 ? 0 : x + 1 },
  decrease: function decrease(x, embed) { return x <= 0 ? x = embed.length - 1 : x - 1 },
  // objects
  objectHaveSameKeys: function(...objects) {
    const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
    const union = new Set(allKeys);
    return objects.every(object => union.size === Object.keys(object).length);
  },
  getObjPath: function(str){
    if (typeof str !== "string") return null;
    return str.match(/(\[("|'|`))?(\w|\-|\/)+(("|'|`)\])?/gm).map(e => e.match(/\[.+\]/g) ? e.slice(2, e.length-2) : e );
  },
  clone: function(source) {
    const target = {};
    for (const key in source)
      target[key] = source[key];
    return target;
  },
  repairObject: function(data, model, first = true) {
    if ((!isObject(data) || !isObject(model)) && first) throw new Error("Invalid values was provided !");
    const [newData, entries] = [{}, Object.entries(model)];
    Object.entries(data).forEach((e) => {
      const modelData = entries.find(m => m[0] == e[0]);
      if (entries.some((m) => m[0] == e[0])) { newData[e[0]] = (modelData && getType(e[1]) !== getType(modelData[1]) ? modelData[1] : e[1]) }; 
      if (getType(e[0]) == "object" && Object.keys(model).includes(e[0])) newData[e] = repairObject(e[1], model[e[0]], false);
    });
    entries.forEach((etr) => { if (Object.keys(newData).some(a => a == etr[0])) return; else { newData[etr[0]] = etr[1]; } });
    return newData;
  },
  // other
  getBalise: function(str, balise, prefix = "-"){
    if (typeof str !== "string" || !Array.isArray(balise) || typeof prefix !== "string") return null;
    return str.split(prefix).filter(e => balise.some(b => e.startsWith(b))).map(e => ({ balise: e.split(/\s+/g)[0], content: e.slice(e.split(/\s+/g)[0].length).trim()}))
  }

}