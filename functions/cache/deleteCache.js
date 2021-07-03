function getGoodLink(str) {
    return str.replace(/\.\.\/\.\.\//g, require.main.path+"/LanaV3.0/").replace(/\.\.\//g, require.main.path+"/LanaV3.0/")
}

module.exports = (file) => {
    try {
        const fulldir = require.resolve(getGoodLink(file))
        delete require.cache[fulldir]
        return true
    } catch(err) {
        return false
    }
}