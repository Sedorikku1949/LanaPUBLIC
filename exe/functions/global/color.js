module.exports = (str) => {
    const obj = { stop: 0, bold: 1, dim: 2, underline: 4, blink: 5, inverted: 7, hide: 8, black: 30, red: 31, green: 32, yellow: 33, blue: 34, magenta: 35, cyan: 36, lightgray: 37, darkgray: 90, lightred: 91, lightgreen: 92, lightyellow: 93, lightblue: 94, lightmagenta: 95, lightcyan: 96, white: 97 }
    return str.replace(/\{(stop|bold|dim|underline|blink|inverted|hide|black|red|green|yellow|blue|magenta|cyan|lightgray|darkgray|lightred|lightgreen|lightyellow|lightblue|lightmagenta|lightcyan|white)\}/g, (_, p) => `\u001b[${obj[p]}m`) + "\u001b[0m"
}
