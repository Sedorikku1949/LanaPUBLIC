const fs = require("fs")
const { config } = require("process")

module.exports = async() => {
    return new Promise( async(resolve, _) => {
        require("./ts.cjs")()
        const f = []
        function getFunctions(dir) {
            fs.readdirSync(dir).forEach(async(subdir) => {
                if (subdir.match(/\.js/g) && !subdir.match(/\.json/g)) {
                    global[subdir.replace(/\.js/g, "")] = require(`../${dir}/${subdir}`);
                    f.push(`../${dir}/${subdir}`)
                }
                else if (subdir.match(/\./g)) return 
                else getFunctions(`${dir}/${subdir}`)
            })
        }
        getFunctions("functions")
        
        require("./proto/prototype")
        require("./proto/defineProperty")()
        
        global["fetch"] = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
        console.log = async function(data) { typeof data == "string" ? process.stdout.write(color(data)+"\n") : process.stdout.write(require("util").inspect(data)+"\n") }

        f.forEach(e => deleteCache(require.resolve(e)))
        deleteCache(require.resolve("./proto/prototype"))
        console.log(`{cyan}{bold}${f.length} files has been removed from the cache !`)
        resolve(true)
    })
}

NODE = process.platform == "android" ? "/data/data/com.termux/files/usr/lib/node_modules/" : require.main.path+'\\node_modules\\'
