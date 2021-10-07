module.exports = async function(){
  require('typescript-require');

  global["kingdom"] = require("./games/src/kingdom.ts")
}