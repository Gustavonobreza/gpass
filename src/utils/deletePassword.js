const { join } = require("path");
const { writeFileSync } = require("fs");
const log = require("./logger");
const { data: dataFile } = require("./passwords.json");

const deletePassword = (provider = "") => {
  if (!provider) return;

  const data = dataFile.filter((item, ind) => {
    const providerInFile = item?.provider;
    if (!providerInFile) return true;

    return providerInFile.toLowerCase() !== provider.toLowerCase();
  });

  if (dataFile.length > 1 && !data.length) return log("error", "Not found provider");
  if (data.length >= dataFile.length) return log("error", "Not found provider");

  const path = join(__dirname, "passwords.json");
  const options = { encoding: "utf-8" };
  const json = JSON.stringify({ data });
  writeFileSync(path, json, options);

  log("success", `Provider ${provider} deleted successfully!`);
};

const deleteAllPassword = () => {
  const data = dataFile.filter((item, ind) => {
    const providerInFile = item?.provider;
    if (!providerInFile) return true;
  });

  if (data.length === dataFile.length) return log("error", "Nothing to delete!");

  const path = join(__dirname, "passwords.json");
  const options = { encoding: "utf-8" };
  const json = JSON.stringify({ data });
  writeFileSync(path, json, options);

  log("success", `All providers was deleted successfully!`);
};

module.exports = { deletePassword, deleteAllPassword };
