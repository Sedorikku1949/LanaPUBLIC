"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var Discord = require("discord.js");
/**
 * Main class for the game
 *
 * REQUIRED @param { Discord.User } = user
 * REQUIRED @param { global } = the global object for database
 *
 * @return {
 *  id: any,
 *  inventory: [],
 *  xp: 0,
 *  lvl: 0,
 * }
 */
var kingdom = /** @class */ (function () {
    function kingdom(user) {
        this.id = "";
        this.inventory = [];
        this.level = 0;
        this.xp = 0;
        if (!user || !(user instanceof Discord.User))
            throw new Error("User must be a discord.js class !");
        this.id = user === null || user === void 0 ? void 0 : user.id;
    }
    ;
    return kingdom;
}());
;
// EXPORT
exports.main = kingdom;
