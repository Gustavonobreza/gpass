const program = require("commander");
const clipboardy = require("clipboardy");
const createPassword = require("./utils/createPassword");
const savePassword = require("./utils/savePassword");
const isBetween = require("./utils/isBetween");
const log = require("./utils/logger");
const { version } = require("../package.json");
const getEntropy = require("./utils/getEntropy");
const info = require("./utils/info");
const { getPassword, getAllPasswords } = require("./utils/getPassword");
const { deleteAllPassword, deletePassword } = require("./utils/deletePassword");

const gpass = async () => {
  program
    .version(version)
    .description("Simple password generator")
    .option("-pr, --provider <name>", "name of provider to save", "")
    .option("-fl, --flush <provider>", "delete specific provider infos", "")
    .option("-l, --length <number>", "length of password", "10")
    .option("-n, --number <number>", "generate number of passwords", "1")
    .option("-g, --get-info <provider>", "get info of saved provider", "")
    .option("-a, --get-all", "get info of all saved providers", false)
    .option("-s, --save", "save password", false)
    .option("-fa --flush-all", "delete all saved passwords", false)
    .option("-el --exclude-lower", "exclude lower letters", false)
    .option("-eu --exclude-upper", "exclude upper letters", false)
    .option("-en --exclude-numbers", "exclude number", false)
    .option("-es --exclude-symbols", "exclude symbols", false)
    .option("-cp --copy", "copy to clipboard", false)
    .option("-p --pin", "create PIN", false)
    .parse();

  const {
    length,
    number,
    save,
    excludeLower: el,
    excludeUpper: eu,
    excludeNumbers: en,
    excludeSymbols: es,
    copy,
    pin,
    provider,
    getInfo: getPass,
    flushAll,
    flush,
    getAll,
  } = program.opts();

  info();

  if (getPass) {
    return getPassword(getPass);
  }
  if (flush) {
    return deletePassword(flush);
  }
  if (flushAll) {
    return deleteAllPassword();
  }
  if (getAll) {
    return getAllPasswords();
  }

  if (!isBetween(length, pin)) {
    // Check length
    if (pin) log("error", "PIN length must be between 3 and 12 characters");
    else log("error", "Password length must be between 6 and 32 characters");
    return;
  }

  const num = parseInt(number, 10);
  if (num > 1) {
    const generatePasswords = async (_number) => {
      const passwords = [];

      for (let i = 0; i < _number; i++) {
        let password;
        if (pin) password = createPassword(false, false, true, false, length);
        else password = createPassword(!el, !eu, !en, !es, length);
        passwords.push(password);

        // Save password
        if (save) savePassword(password, false, provider);
      }

      return Promise.resolve(passwords);
    };

    const passwords = await generatePasswords(num);
    const lastPass = passwords[passwords.length - 1];

    log("success", `${num} ${pin ? "PINs" : "Passwords"} generated`);
    log("general", passwords.join("\n"));
    if (save) log("info", `${pin ? "PINs" : "Passwords"} successfully saved to file`);

    // Copy to clipboard
    if (copy) {
      clipboardy.writeSync(lastPass);
      if (pin) log("info", "Last PIN successfully copied to clipboard!");
      else log("info", "Last Password successfully copied to clipboard");
    }

    log("info", `Entropy of last ${pin ? "PIN" : "password"} is ${getEntropy(lastPass)}`);
  } else {
    // Create password
    let password;
    if (pin) password = createPassword(false, false, true, false, length);
    else password = createPassword(!el, !eu, !en, !es, length);
    log("success", `${pin ? "PIN" : "Password"} generated`, password);

    // Save password
    if (save) savePassword(password, true, provider);

    // Copy to clipboard
    if (copy) {
      clipboardy.writeSync(password);
      if (pin) log("info", "PIN successfully copied to clipboard!");
      else log("info", "Password successfully copied to clipboard");
    }

    log("info", `Entropy is ${getEntropy(password)}`);
  }
};

module.exports = gpass;
