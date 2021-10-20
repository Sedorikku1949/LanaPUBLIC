const { writeFileSync } = require("fs");

function getGoodLink(str) {
  return str.replace(/\.\.\/\.\.\//g, require.main.path+"/LanaV3.0/").replace(/\.\.\//g, require.main.path+"/LanaV3.0/")
}

module.exports = {
  getGoodLink: getGoodLink,
  createFile: (key, dir, data) => {
    if (!data || typeof data !== "object" || !key || typeof key !== "string" || !key.match(/\./g) || key.endsWith("/") || typeof dir !== "string" || dir.endsWith("/")) throw new Error("I can't create a file with these values !")
    return new Promise((resolve, _) => {
      try {
        writeFileSync(`${dir}${dir ? "/" : "" }${key}`, JSON.stringify(data, null, 1))
        resolve(true)
      } catch(err) {
        resolve(false)
      }
    })
  },
  reloadAllCache: () => {
    Object.entries(require.cache).filter(e => !e[0].match(/node_modules/g)).forEach((file) => {
      try {
        const fulldir = require.resolve(file);
        delete require.cache[fulldir];
        require(fulldir);
      } catch(err) {}
    })
    return true
  },
  reloadCacheFile: (file) => {
    try {
      const fulldir = require.resolve(file)
      delete require.cache[fulldir]
      require.cache[fulldir] = require(file)
      return true
    } catch(err) {
      return false
    }
  },
  updateFile: (dir, data) => {
    if (!dir || typeof dir !== "string" || !data || typeof data !== "object") throw new Error("Invalids arguments for update a file !")
    return new Promise((resolve, _) => {
      try {
        const fulldir = require.resolve(getGoodLink(dir))
        if (!fulldir) return resolve(false)
        writeFileSync(fulldir, JSON.stringify(data, null, 1))
        resolve(true)
      } catch(err) {
        resolve(false)
      }
    })
  }
}