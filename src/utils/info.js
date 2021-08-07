const welcome = require("cli-welcome");
const { version } = require("../../package.json");

const info = () =>
  welcome({
    title: "gPass CLI",
    tagLine: "by GustavoNobreza forked from Padelis Theodosiou",
    bgColor: "#FADC00",
    color: "#000000",
    clear: true,
    version,
  });

module.exports = info;
