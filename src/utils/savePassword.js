const { join } = require("path");
const { writeFileSync } = require("fs");
const log = require("./logger");
const { data: dataFile } = require("./passwords.json");

const savePassword = (password, showInfo = true, provider) => {
  if (!password) return;
  try {
    const path = join(__dirname, "passwords.json");
    const options = { encoding: "utf-8" };

    if (!provider) {
      dataFile.push(password);
      const json = JSON.stringify({ data: dataFile });
      writeFileSync(path, json, options);
    } else {
      dataFile.push({ provider, password, date: new Date().toLocaleString() });
      const json = JSON.stringify({ data: dataFile });
      writeFileSync(path, json, options);
    }

    if (showInfo) log("info", "Password successfully saved to file");
  } catch (error) {
    const err = error
      .toString()
      .replace(/^(.*?)\\:/, "")
      .trim();
    if (showInfo) log("error", "Failed to save file", err);
  }
};

module.exports = savePassword;
