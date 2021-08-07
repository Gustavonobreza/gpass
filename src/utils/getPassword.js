const log = require("./logger");
const { data: dataFile } = require("./passwords.json");

const getPassword = (provider = "") => {
  if (!provider) return;

  const data = dataFile.filter((item) => {
    const providerInFile = item?.provider;
    if (!providerInFile) return false;

    return providerInFile.toLowerCase() === provider.toLowerCase();
  });

  if (!data.length) return log("error", "Not found provider");

  log("success", data.map(({ provider, password, date }) => `${[provider, `"${password}"`].join(": ")}\n\t date: ${date}`).join("\n"));
};

const getAllPasswords = () => {
  const data = dataFile.filter((item) => {
    const providerInFile = item?.provider;
    if (providerInFile) return true;
  });

  if (!data.length) return log("error", "Not found provider");

  log("success", data.map(({ provider, password, date }) => `${[provider, `"${password}"`].join(": ")}\n\t date: ${date}`).join("\n"));
};

module.exports = { getPassword, getAllPasswords };
