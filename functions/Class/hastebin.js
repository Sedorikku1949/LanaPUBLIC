const baseUrl = "https://hastebin.com"
const fetch = require('node-fetch');

async function createHastebin(body, url, options){
    return await fetch(`${url}/documents`, options);
}

module.exports = class hastebin {
    static async create(body){
        const res = await ((await (createHastebin(body, baseUrl, { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' }}))).json())
        return baseUrl+"/"+res.key
    };
}