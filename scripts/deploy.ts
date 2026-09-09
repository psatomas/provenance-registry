// NOTE: This file only defines a Hardhat Ignition module - it does nothing
// by itself if executed with `npx hardhat run scripts/deploy.ts`. The
// canonical deployment module and command are:
//
//   npx hardhat ignition deploy ignition/modules/ProtocolRegistry.ts --network sepolia
//
// See docs/deployment.md. This file is kept for historical/local reference.

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("RegistryModule", (m) => {
  // Define the contract deployment
  const registry = m.contract("ProtocolProvenanceRegistry");

  // If you had constructor arguments, you'd put them in the array, e.g.:
  // const registry = m.contract("ProtocolProvenanceRegistry", [arg1, arg2]);

  return { registry };
});