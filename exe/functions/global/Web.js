const https = require("https");

module.exports = {
  postRes: function({body, ...options}) {
    return new Promise((resolve,reject) => {
        const req = https.request({
            method: 'POST',
            ...options,
        }, res => {
            const chunks = [];
            res.on('data', data => chunks.push(data))
            res.on('end', () => {
                let body = Buffer.concat(chunks);
                switch(res.headers['content-type']) {
                    case 'application/json':
                        body = JSON.parse(body);
                        break;
                }
                resolve(body)
            })
        });

        req.on('error',reject);
        if(body) { req.write(body); };
        req.end();
    });
}
}