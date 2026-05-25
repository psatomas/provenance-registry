import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  console.log("Starting deployment...");

  const artifact = await hre.artifacts.readArtifact(
    "ProtocolProvenanceRegistry"
  );

  const provider = new ethers.JsonRpcProvider(
    "http://127.0.0.1:8545"
  );

  const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  const contract = await factory.deploy();

  await contract.waitForDeployment();

  console.log(
    "Deployed to:",
    await contract.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});