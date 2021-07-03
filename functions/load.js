const fs = require("fs")

module.exports = async() => {
    return new Promise( async(resolve, _) => {
        const f = []
        function getFunctions(dir) {
            fs.readdirSync(dir).forEach((subdir) => {
                if (subdir.match(/\.js/g) && !subdir.match(/\.json/g)) return (global[subdir.replace(/\.js/g, "")] = require(`../${dir}/${subdir}`)) && f.push(`../${dir}/${subdir}`)
                if (subdir.match(/\./g)) return 
                else getFunctions(`${dir}/${subdir}`)
            })
        }
        getFunctions("functions")
        
        require("./proto/prototype")
        
        console.log = function(data) { typeof data == "string" ? process.stdout.write(color(data)+"\n") : process.stdout.write(require("util").inspect(data)+"\n") }

        f.forEach(e => deleteCache(require.resolve(e)))
        deleteCache(require.resolve("./proto/prototype"))
        console.log(`{cyan}{bold}${f.length} files has been removed from the cache !`)
        resolve(true)
    })
}

NODE = process.platform == "android" ? "/data/data/com.termux/files/usr/lib/node_modules/" : require.main.path+'\\node_modules\\'

