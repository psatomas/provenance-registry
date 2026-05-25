import { ethers } from "ethers";
import hre from "hardhat";

async function main() {

    console.log("Starting interaction...\n");

    // =========================================================
    //                         ARTIFACT
    // =========================================================

    const artifact = await hre.artifacts.readArtifact(
        "ProtocolProvenanceRegistry"
    );

    // =========================================================
    //                         PROVIDER
    // =========================================================

    const provider = new ethers.JsonRpcProvider(
        "http://127.0.0.1:8545"
    );

    // =========================================================
    //                         SIGNERS
    // =========================================================

    const owner = await provider.getSigner(0);

    const attacker = await provider.getSigner(1);

    // =========================================================
    //                    CONTRACT ADDRESS
    // =========================================================

    const contractAddress =
        "YOUR_DEPLOYED_CONTRACT_ADDRESS";

    // =========================================================
    //                    OWNER CONTRACT
    // =========================================================

    const ownerContract = new ethers.Contract(
        contractAddress,
        artifact.abi,
        owner
    );

    // =========================================================
    //                  ATTACKER CONTRACT
    // =========================================================

    const attackerContract = new ethers.Contract(
        contractAddress,
        artifact.abi,
        attacker
    );

    console.log("Connected to contract\n");

    // =========================================================
    //                     HASH GENERATION
    // =========================================================

    const auditHash = ethers.keccak256(
        ethers.toUtf8Bytes(
            "audit-pdf-content"
        )
    );

    const commitHash = ethers.keccak256(
        ethers.toUtf8Bytes(
            "commit-sha"
        )
    );

    // =========================================================
    //                  SUCCESSFUL REGISTRATION
    // =========================================================

    console.log(
        "Testing owner registration...\n"
    );

    const tx =
        await ownerContract.registerProtocolRecord(
            "ProofChain",
            "0x1234567890123456789012345678901234567890",
            "v1.0.0",
            auditHash,
            commitHash,
            "OpenZeppelin"
        );

    console.log("Transaction sent");

    await tx.wait();

    console.log(
        "Owner registration successful\n"
    );

    // =========================================================
    //                     READ PROTOCOL
    // =========================================================

    const history =
        await ownerContract.getProtocolHistory(
            "0x1234567890123456789012345678901234567890"
        );

    console.log("Protocol History:\n");

    history.forEach(
        (record: any, index: number) => {

            console.log(
                `Record #${index + 1}`
            );

            console.log(
                "Protocol Name:",
                record.protocolName
            );

            console.log(
                "Contract Address:",
                record.contractAddress
            );

            console.log(
                "Version:",
                record.version
            );

            console.log(
                "Audit Hash:",
                record.auditHash
            );

            console.log(
                "Commit Hash:",
                record.commitHash
            );

            console.log(
                "Auditor:",
                record.auditor
            );

            console.log(
                "Timestamp:",
                record.timestamp.toString()
            );

            console.log();
        }
    );

    // =========================================================
    //                    NON OWNER TEST
    // =========================================================

    console.log(
        "Testing unauthorized registration...\n"
    );

    try {

        await attackerContract.registerProtocolRecord(
            "MaliciousProtocol",
            "0x9999999999999999999999999999999999999999",
            "v999",
            auditHash,
            commitHash,
            "FakeAuditor"
        );

        console.log(
            "Authorization FAILED"
        );

    } catch (error) {

        console.log(
            "Authorization working correctly"
        );
    }
}

main().catch((error) => {

    console.error(error);

    process.exitCode = 1;
});