const Discord = require("discord.js");

module.exports = class securityTemplate {
    constructor(guild, db){
        if ( !(guild instanceof Discord.Guild) || typeof db !== "object" || Array.isArray(db) ) return null;
        /* general */
        this.id = guild.id;

        /* GuildMember */
        this.members = guild.memberCount;
        this.human = guild.members.cache.filter(e => !(e.user.bot) ).size;
        this.bot = guild.members.cache.filter(e => !(e.user.bot) ).size;
        this.users = guild.members.cache.array();
        this.owner = guild.owner;

        /* settings */
        this.roles = guild.roles.cache;
        this.channels = guild.channels.cache;
        this.explicitContentFilter = guild.explicitContentFilter;

        /* sanctions */
        this.notes  = db.sanctions.note.filter(e => guild.members.selectMember(e.id));
        this.warns = db.sanctions.warn.filter(e => guild.members.selectMember(e.id));
        this.kick = db.sanctions.kick.filter(e => guild.members.selectMember(e.id));
        this.ban = db.sanctions.ban.filter(e => guild.members.selectMember(e.id));

        /* activity */
        this.messages = {};
        this.joins = {};
        this.leaves = {};

        /* events */
        this.botAdded = {};
        this.channelCreate = {};
        this.channelUpdate = {};
        this.channelDelete = {};
        this.roleCreate = {};
        this.roleUpdate = {};
        this.roleDelete = {};
        this.messageDelete = {};
        this.messageUpdate = {};
        this.guildBanAdd = {};
        this.guildBanRemove = {};
        this.inviteCreate = {};

        /* other */
        this.database = db;
    };
};