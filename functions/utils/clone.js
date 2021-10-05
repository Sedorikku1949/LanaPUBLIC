module.exports = function(source) {
  const target = {};
  for (const key in source)
    target[key] = source[key];
  return target;
}