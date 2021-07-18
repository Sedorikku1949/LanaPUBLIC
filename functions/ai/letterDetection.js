const brain = require("brain.js");

module.exports = async function(data){
    const net = new brain.NeuralNetwork();

    const train = Date.now();
    net.train([
        { input: { members: 163, messagesInTeenSeconds: 3, badwords: 0, invite: 14, join: 24 }, output: { inviteSpam: 1, spam: 0.5, raid: 1 } },
        { input: { members: 48, messagesInTeenSeconds: 2, badwords: 0, invite: 0, join: 1 }, output: { calm: 1 } },
        { input: { members: 96, messagesInTeenSeconds: 11, badwords: 5, invite: 0, join: 3 }, output: { troll: 1 } },
        { input: { members: 251, messagesInTeenSeconds: 4, badwords: 7, invite: 0, join: 1 }, output: { badwordSpam: 1 } },
        { input: { members: 4682, messagesInTeenSeconds: 430, badwords: 2, invite: 1, join: 23 }, output: { calm: 1 } },
    ])
    console.log("L'IA s'est entrainée en "+(Date.now() - train)+"ms")

    const start = Date.now();
    const output = net.run(data);
    console.log("L'IA a prédit en "+(Date.now() - start)+"ms")
    return output;
};