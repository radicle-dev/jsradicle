const edn = require("jsedn");

exports.parseRadicle = (radicle) => {
  return edn.toJS(edn.parse(radicle));
}

// TODO: Remove regexp, should be done via jsedn or similar
// regexp 1: `":kw":` -> `:kw`
// regexp 2: `"<numbers>"` -> `<numbers>`
exports.toRadicle = (js) => {
  return edn.encode(js).replace(/\":(\S*)"/g, ":$1").replace(/\"(\d*)\"/g, "$1")
}
