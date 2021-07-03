module.exports = () => {
    Object.entries(require.cache).filter(e => !e[0].match(/node_modules/g)).forEach((file) => {
        try {
            const fulldir = require.resolve(file);
            delete require.cache[fulldir];
            require(fulldir);
        } catch(err) {}
    })
    return true
}