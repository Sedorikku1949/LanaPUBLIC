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

fetch("https://images8.alphacoders.com/105/1054256.jpg")

module.exports = class img{
    static fetchImg(url) {
      if (!url || typeof url !== "string" || !url.match(/http(s?):\/\/\S{2,}/gi)) return Buffer.alloc()
    };
    static getBuffer() {};
    static averageColor() {};
};