module.exports = function(str, balise, prefix = "-"){
  if (typeof str !== "string" || !Array.isArray(balise) || typeof prefix !== "string") return null;
  return str.split(prefix).filter(e => balise.some(b => e.startsWith(b))).map(e => ({ balise: e.split(/\s+/g)[0], content: e.slice(e.split(/\s+/g)[0].length).trim()}))
};