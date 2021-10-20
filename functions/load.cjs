const { readdirSync } = require("fs")

module.exports = async() => {
  return new Promise( async(resolve, _) => {
    require("./ts.cjs")()
    const f = []
    function getFunctions(dir) {
      readdirSync(dir).forEach(async(subdir) => {
        if (subdir.match(/\.js/g) && !subdir.match(/\.json/g)) {
          global[subdir.replace(/\.js/g, "")] = require(`../${dir}/${subdir}`);
          f.push(`../${dir}/${subdir}`)
        }
        else if (subdir.match(/\./g)) return 
        else getFunctions(`${dir}/${subdir}`)
      })
    }
    getFunctions("functions/global")
    
    require("./proto/prototype")
    require("./proto/defineProperty")()
    
    

    f.forEach(e => deleteCache(require.resolve(e)))
    deleteCache(require.resolve("./proto/prototype"))
    
    resolve(true)
  })
}

