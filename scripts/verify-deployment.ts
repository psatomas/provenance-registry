// =========================================================
// POST-DEPLOYMENT VERIFICATION
// =========================================================
//
// Read-only sanity checks against a freshly deployed
// ProtocolProvenanceRegistry. Used by the manual Sepolia
// deployment workflow (.github/workflows/deploy-sepolia.yml)
// right after `hardhat ignition deploy`, and safe to run
// locally against any network the contract was deployed to.
//
// This script only ever reads state or performs a read-only
// `eth_call` simulation (via .staticCall). It never sends a
// transaction and never needs a private key.
//
// Usage:
//   npx hardhat run scripts/verify-deployment.ts --network sepolia
//
// By default the script looks up the address from the Hardhat
// Ignition deployment record for the current chain
// (ignition/deployments/chain-<id>/deployed_addresses.json).
// To verify a specific address instead (e.g. one not produced by
// an Ignition deployment in this checkout), set VERIFY_ADDRESS.
// (`hardhat run` does not forward extra CLI arguments to scripts.)

import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import hre from "hardhat";

const IGNITION_FUTURE_ID =
    "ProtocolRegistryModule#ProtocolProvenanceRegistry";

// A well-known, definitely-not-the-owner address used only for the
// read-only NotOwner simulation below. No key for it is needed or used.
const SIMULATED_NON_OWNER = "0x000000000000000000000000000000000000dEaD";

function resolveAddressFromEnv(): string | undefined {
    const override = process.env.VERIFY_ADDRESS;

    if (override && !ethers.isAddress(override)) {
        throw new Error(`VERIFY_ADDRESS is not a valid address: ${override}`);
    }

    return override;
}

function resolveAddressFromIgnition(chainId: number): string | undefined {
    // Resolved relative to the current working directory, which is expected
    // to be the repository root (consistent with this project's other
    // scripts, e.g. scripts/make-test-pdf.ts writing to ./test-audit.pdf).
    const deploymentFile = path.join(
        process.cwd(),
        "ignition",
        "deployments",
        `chain-${chainId}`,
        "deployed_addresses.json"
    );

    if (!fs.existsSync(deploymentFile)) {
        return undefined;
    }

    const deployedAddresses = JSON.parse(
        fs.readFileSync(deploymentFile, "utf-8")
    );

    return deployedAddresses[IGNITION_FUTURE_ID];
}

async function main() {

    const rpcUrl = process.env.SEPOLIA_RPC_URL;

    if (!rpcUrl) {
        throw new Error(
            "SEPOLIA_RPC_URL is not set - cannot connect to the network to verify the deployment."
        );
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    const address =
        resolveAddressFromEnv() ??
        resolveAddressFromIgnition(chainId);

    if (!address) {
        throw new Error(
            `Could not determine the deployed contract address. Set VERIFY_ADDRESS ` +
            `explicitly, or ensure ignition/deployments/chain-${chainId}/deployed_addresses.json exists.`
        );
    }

    console.log(`Verifying deployment at ${address} (chainId ${chainId})\n`);

    const artifact = await hre.artifacts.readArtifact(
        "ProtocolProvenanceRegistry"
    );

    const failures: string[] = [];

    // ---------------------------------------------------------
    // 1. Bytecode exists at the address
    // ---------------------------------------------------------

    const deployedCode = await provider.getCode(address);

    if (!deployedCode || deployedCode === "0x") {
        failures.push("No bytecode found at the deployed address.");
    } else {
        console.log("[ok] Contract bytecode exists at the address.");
    }

    // ---------------------------------------------------------
    // 2. Deployed bytecode matches the current compiled contract
    //    (i.e. this is genuinely the current source, not a stale
    //    or different deployment reusing the same ABI).
    // ---------------------------------------------------------

    if (deployedCode === artifact.deployedBytecode) {
        console.log("[ok] Deployed bytecode matches the current compiled contract exactly.");
    } else {
        failures.push(
            "Deployed bytecode does NOT match the current compiled contract. " +
            "This address may be running older or different source code."
        );
    }

    const contract = new ethers.Contract(address, artifact.abi, provider);

    // ---------------------------------------------------------
    // 3. owner() responds with a well-formed, non-zero address
    // ---------------------------------------------------------

    try {
        const owner = await contract.owner();

        if (!ethers.isAddress(owner) || owner === ethers.ZeroAddress) {
            failures.push(`owner() returned an invalid address: ${owner}`);
        } else {
            console.log(`[ok] owner() returns a valid, non-zero address: ${owner}`);
        }
    } catch (err) {
        failures.push(`owner() call failed: ${(err as Error).message}`);
    }

    // ---------------------------------------------------------
    // 4. Basic reads on the current ABI succeed (confirms the
    //    expected interface is actually present and responsive).
    // ---------------------------------------------------------

    try {
        const count = await contract.getRecordCount(ethers.ZeroAddress);
        console.log(`[ok] getRecordCount() responds correctly (returned ${count}).`);
    } catch (err) {
        failures.push(`getRecordCount() call failed: ${(err as Error).message}`);
    }

    // ---------------------------------------------------------
    // 5. Authorization: a non-owner call to registerProtocolRecord
    //    must revert with NotOwner. This is a read-only eth_call
    //    simulation (.staticCall with a `from` override) - no
    //    transaction is broadcast and no private key is used.
    // ---------------------------------------------------------

    try {
        await contract.registerProtocolRecord.staticCall(
            "CI Verification Probe",
            "0x1234567890123456789012345678901234567890",
            "v0.0.0",
            ethers.keccak256(ethers.toUtf8Bytes("verification-probe-audit")),
            ethers.keccak256(ethers.toUtf8Bytes("verification-probe-commit")),
            "CI",
            { from: SIMULATED_NON_OWNER }
        );

        failures.push(
            "registerProtocolRecord did NOT revert for a non-owner caller - " +
            "authorization is not enforced on this deployment."
        );
    } catch (err: any) {
        const errorData = err?.data ?? err?.info?.error?.data;
        const errorName = errorData
            ? contract.interface.parseError(errorData)?.name
            : undefined;

        if (errorName === "NotOwner") {
            console.log(
                "[ok] Non-owner registerProtocolRecord simulation reverts with NotOwner, as expected."
            );
        } else if (errorName) {
            failures.push(
                `Non-owner call reverted, but with "${errorName}" instead of "NotOwner".`
            );
        } else {
            failures.push(
                `Non-owner call reverted, but the revert reason could not be decoded ` +
                `(raw: ${JSON.stringify(errorData)}). Cannot confirm it was NotOwner.`
            );
        }
    }

    // ---------------------------------------------------------
    // RESULT
    // ---------------------------------------------------------

    console.log();

    if (failures.length > 0) {
        console.error(`Deployment verification FAILED (${failures.length} issue(s)):\n`);
        failures.forEach((f) => console.error(` - ${f}`));
        process.exitCode = 1;
        return;
    }

    console.log("Deployment verification PASSED. All checks succeeded.");
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
