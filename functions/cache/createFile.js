const fs = require("fs")

module.exports = (key, dir, data) => {
    if (!data || typeof data !== "object" || !key || typeof key !== "string" || !key.match(/\./g) || key.endsWith("/") || typeof dir !== "string" || dir.endsWith("/")) throw new Error("I can't create a file with these values !")
    return new Promise((resolve, _) => {
        try {
            fs.writeFileSync(`${dir}${dir ? "/" : "" }${key}`, JSON.stringify(data, null, 1))
            resolve(true)
        } catch(err) {
            resolve(false)
        }
    })
}