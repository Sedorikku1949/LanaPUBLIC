const CRYPTO = require("crypto");

const accessKey = JSON.parse(require("fs").readFileSync("exe/_storage/_config/boot.json")).encryptKey ?? "kjgfdF5g8-fdjkzi@zel&";
const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
const algorithm = "aes-256-ctr";
const iv = require("fs").readFileSync("randomBytes");

function accessKeyCheck(c){
  if (c === accessKey) return true;
  else return false;
}

class encrypt {
  constructor(){
    this.encrypt = function(text, key){
      if (!accessKeyCheck(key)) throw new Error("The authentification as failed, invalid code !");
      const cipher = CRYPTO.createCipheriv(algorithm, secretKey, iv);
      const data = typeof text == "string" ? text : JSON.stringify(text, null, 2);
      const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
      return { iv: iv.toString("hex"), content: encrypted.toString("hex") };
    };
    this.decrypt = function(hash, key){
      if (!accessKeyCheck(key)) throw new Error("The authentification as failed, invalid code !");
      const decipher = CRYPTO.createDecipheriv(
        algorithm,
        secretKey ,
        Buffer.from(hash.iv, "hex")
      );
      const decrpyted = Buffer.concat([
        decipher.update(Buffer.from(hash.content, "hex")),
        decipher.final(),
      ]);
      return decrpyted.toString();
    };
  }
}

module.exports = encrypt;