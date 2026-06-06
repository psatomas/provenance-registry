// ignition/modules/ProtocolRegistry.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ProtocolRegistryModule", (m) => {
  // Define the contract deployment
  // If your constructor requires arguments, pass them in the array: [arg1, arg2]
  const registry = m.contract("ProtocolProvenanceRegistry", []);

  return { registry };
});