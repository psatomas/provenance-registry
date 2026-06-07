import { defineConfig } from "hardhat/config";
import * as dotenv from "dotenv";

// Explicitly initialize dotenv
dotenv.config();

// Explicit plugin imports
import HardhatIgnitionEthersPlugin from "@nomicfoundation/hardhat-ignition-ethers";
import HardhatVerifyPlugin from "@nomicfoundation/hardhat-verify";

export default defineConfig({
  plugins: [
    HardhatIgnitionEthersPlugin,
    HardhatVerifyPlugin,
  ],
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.SEPOLIA_RPC_URL ?? "",
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
    },
  },
  verify: {
    etherscan: {
      // Force string type explicitly to satisfy Hardhat's HHE15 check
      apiKey: String(process.env.ETHERSCAN_API_KEY || ""),
    },
  },
  test: {
    solidity: {
      fuzz: {
        runs: 256,
      },
    },
  },
});