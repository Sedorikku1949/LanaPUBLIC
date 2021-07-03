module.exports = (file) => {
    try {
        const fulldir = require.resolve(file)
        delete require.cache[fulldir]
        require.cache[fulldir] = require(file)
        return true
    } catch(err) {
        return false
    }
}