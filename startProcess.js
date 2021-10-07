async function execute() {
  console.log("\u001b[31mChargement du global, veuillez patienter\u001b[0m");
  await require("./functions/load.cjs")();

  require("./loader.js");
}

execute();
