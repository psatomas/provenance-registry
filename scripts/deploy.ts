import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("RegistryModule", (m) => {
  // Define the contract deployment
  const registry = m.contract("ProtocolProvenanceRegistry");

  // If you had constructor arguments, you'd put them in the array, e.g.:
  // const registry = m.contract("ProtocolProvenanceRegistry", [arg1, arg2]);

  return { registry };
});