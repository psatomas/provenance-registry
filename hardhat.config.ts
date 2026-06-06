import { defineConfig, configVariable } from "hardhat/config";

// 1. Import the default exports
import HardhatIgnitionEthersPlugin from "@nomicfoundation/hardhat-ignition-ethers";
import HardhatVerifyPlugin from "@nomicfoundation/hardhat-verify";

export default defineConfig({
  // 2. Pass the actual objects, not strings.
  // This satisfies the HardhatPlugin interface requirement.
  plugins: [
    HardhatIgnitionEthersPlugin,
    HardhatVerifyPlugin
  ],

  solidity: "0.8.28",

  networks: {
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },

  verify: {
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
  },
});