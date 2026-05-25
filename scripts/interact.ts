import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  console.log("Starting interaction...\n");

  const provider = new ethers.JsonRpcProvider(
    "http://127.0.0.1:8545"
  );

  const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    provider
  );

  const artifact = await hre.artifacts.readArtifact(
    "ProtocolProvenanceRegistry"
  );

  const contract = new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    artifact.abi,
    wallet
  );

  console.log("Connected to contract\n");

  const targetContract =
    "0x1234567890123456789012345678901234567890";

  const tx = await contract.registerProtocolRecord(
    "ProofChain",
    targetContract,
    "v1.0.0",
    "QmAuditHash",
    "commit123",
    "OpenZeppelin"
  );

  console.log("Transaction sent...");

  await tx.wait();

  console.log("Protocol registered\n");

  const history = await contract.getProtocolHistory(
    targetContract
  );

  console.log("Protocol History:");

  history.forEach((record: any, index: number) => {
    console.log(`\nRecord #${index + 1}`);

    console.log("Protocol Name:", record.protocolName);
    console.log("Contract Address:", record.contractAddress);
    console.log("Version:", record.version);
    console.log("Audit Hash:", record.auditHash);
    console.log("Commit Hash:", record.commitHash);
    console.log("Auditor:", record.auditor);
    console.log("Timestamp:", record.timestamp.toString());
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});