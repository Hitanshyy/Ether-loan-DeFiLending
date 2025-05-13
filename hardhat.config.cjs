require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.28",
      },
      {
        version: "0.8.20", // if some contracts need this
      },
    ],
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL, // Ensure this is set correctly in your .env file
      accounts: [process.env.PRIVATE_KEY], // Ensure this is set correctly in your .env file
    },
  },
};
