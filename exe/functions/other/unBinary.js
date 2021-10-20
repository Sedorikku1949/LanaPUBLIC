module.exports = function(txt){
  if (typeof txt !== "string" || txt.length < 1 || string.match(/[0-1]+/g)) return null;
  return text.split(" ").map((n) => String.fromCharCode(parseInt(n, 2))).join("")
}