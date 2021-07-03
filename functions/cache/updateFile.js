const fs = require("fs")
function getGoodLink(str) {
    return str.replace(/\.\.\/\.\.\//g, require.main.path+"/LanaV3.0/").replace(/\.\.\//g, require.main.path+"/LanaV3.0/")
}

module.exports = (dir, data) => {
    if (!dir || typeof dir !== "string" || !data || typeof data !== "object") throw new Error("Invalids arguments for update a file !")
    return new Promise((resolve, _) => {
        try {
            const fulldir = require.resolve(getGoodLink(dir))
            if (!fulldir) return resolve(false)
            fs.writeFileSync(fulldir, JSON.stringify(data, null, 1))
            resolve(true)
        } catch(err) {
            resolve(false)
        }
    })
}