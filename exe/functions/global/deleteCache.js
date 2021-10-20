

module.exports = (file) => {
  try {
    const fulldir = require.resolve(getGoodLink(file))
    delete require.cache[fulldir]
    return true
  } catch(err) {
    return false
  }
}