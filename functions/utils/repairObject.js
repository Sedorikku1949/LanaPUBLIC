function isObject(data) { return typeof data == "object" && !Array.isArray(data) };

function getType(data) {
  if (typeof data == "object") return Array.isArray(data) ? "array":"object";
  else return typeof data;
}

module.exports = function(data, model, first = true) {
  if ((!isObject(data) || !isObject(model)) && first) throw new Error("Invalid values was provided !");
  const newData = {};
  const entries = Object.entries(model);
  Object.entries(data).forEach((e) => {
    const modelData = entries.find(m => m[0] == e[0]);
    if (entries.some((m) => m[0] == e[0])) { newData[e[0]] = (modelData && getType(e[1]) !== getType(modelData[1]) ? modelData[1] : e[1]) }; 
    if (getType(e[0]) == "object" && Object.keys(model).includes(e[0])) newData[e] = repairObject(e[1], model[e[0]], false);
  });
  entries.forEach((etr) => {
    if (Object.keys(newData).some(a => a == etr[0])) return;
    else { newData[etr[0]] = etr[1]; }
  })

  return newData;
}