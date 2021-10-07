module.exports = function(str){
  if (typeof str !== "string") return null;
  return str.match(/(\[("|'|`))?(\w|\-|\/)+(("|'|`)\])?/gm).map(e => e.match(/\[.+\]/g) ? e.slice(2, e.length-2) : e );
}