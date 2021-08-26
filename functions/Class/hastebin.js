const baseUrl = "https://hastebin.com"
const fetch = require('node-fetch');

async function createHastebin(url, options){
    return await fetch(`${url}/documents`, options);
}

module.exports = class hastebin {
    /** 
     * @param { Object } = Any
     * @param { String } = Any
     * @param { Array } = Any
     * @param { Boolean } = Any
     * @param { Number } = Any
     * @param { Other } = Any
     * 
     * @param return url
     * 
    */
    static async create(body){
        return new Promise(async function(resolve,_){
            const res = await ((await (createHastebin(baseUrl, { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' }}))).json())
            resolve(baseUrl+"/"+res.key)
        })
    };

    /**
     * @param { Object } = { name: { String }, data: (Array || Map) }
     * @param return UrlArray
     *  */
    static async saveDatabase(arr){
        if (!arr || !Array.isArray(arr)) throw new Error("I can use only an Array at the entries");
        return await this.create(JSON.stringify(arr, null, 2));
    }
}