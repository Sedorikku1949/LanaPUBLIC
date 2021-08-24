const fetch = require("node-fetch");

const getBuffer = async (url) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  } catch (error) {
    return { error };
  }
};

module.exports = class img{
    static async fetchImg(url) {
      if (!url || typeof url !== "string" || !url.match(/https?:\/\/\S{2,}/gi)) return new Buffer("")
      return getBuffer(url);
    };
    static async getBufferData(url) {
      if (!url || typeof url !== "string" || !url.match(/https?:\/\/\S{2,}/gi)) return new Buffer("")
      return this.fetchImg(url).then(e => e.toJSON() )
    }
    static async averageColor(data){
      return new Promise(async function(resolve, _){
        try{

          let arr = data;
          if (Buffer.isBuffer(data)) arr = data.toJSON().data
          else if (!Array.isArray(data)) throw new Error("Data can be only a buffer or an array !")
          if (!Array.isArray(arr)) throw new Error("An error as occured, the data type is not an array")
          let t = arr.splitArray(3).map(e => ({ r: e[0], g: e[1], b: e[2] }))
          let allPixels = [];
          let g = 0;
          while(g < t.length) { if (g%10 == 0) allPixels.push(t); g++ };
          let allColors = [];
          allPixels.forEach(e => { if (!allColors.includes(e)) return allColors.push(e) });

          let colorNumbers = [];
          allColors.forEach(e => {
            let index = colorNumbers.findIndex(z => z.color == e);
            if (!index || index < 0) { colorNumbers.push({ color: e, i: 1 }); index = colorNumbers.findIndex(z => z.color == e); }
            colorNumbers[index].i++
          })

          resolve(colorNumbers.sort((a,b) => b.i - a.i));
  
        } catch(err){
          resolve(err);
        }
      })
    };
};