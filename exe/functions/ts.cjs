module.exports = async function(){
  require('typescript-require');

  global["game"].kingdom = require("./games/src/kingdom.ts")?.kingdom
}