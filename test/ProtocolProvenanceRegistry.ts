import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "ethers";

type ProtocolContract = ethers.Contract & {
    registerProtocolRecord(
        protocolName: string,
        contractAddress: string,
        version: string,
        auditHash: string,
        commitHash: string,
        auditor: string
    ): Promise<any>;

    owner(): Promise<string>;
    getProtocolHistory(address: string): Promise<any[]>;
};

describe("ProtocolProvenanceRegistry", function () {

    async function deployFixture() {

        const artifact = await hre.artifacts.readArtifact(
            "ProtocolProvenanceRegistry"
        );

        const provider = new ethers.JsonRpcProvider(
            "http://127.0.0.1:8545"
        );

        const [ownerSigner, attackerSigner] = await Promise.all([
            provider.getSigner(0),
            provider.getSigner(1),
        ]);

        const factory = new ethers.ContractFactory(
            artifact.abi,
            artifact.bytecode,
            ownerSigner
        );

        const deployed = await factory.deploy();
        await deployed.waitForDeployment();

        const address = await deployed.getAddress();

        const contract = new ethers.Contract(
            address,
            artifact.abi,
            ownerSigner
        ) as ProtocolContract;

        const attackerContract = contract.connect(attackerSigner) as ProtocolContract;

        return {
            contract,
            attackerContract,
            ownerSigner,
            attackerSigner,
            address
        };
    }

    // =========================================================
    // DEPLOYMENT
    // =========================================================

    it("should deploy successfully and set owner", async function () {

        const { contract, ownerSigner } = await deployFixture();

        expect(await contract.owner()).to.equal(
            await ownerSigner.getAddress()
        );
    });

    // =========================================================
    // SUCCESS CASE
    // =========================================================

    it("should register protocol record", async function () {

        const { contract } = await deployFixture();

        const auditHash = ethers.keccak256(
            ethers.toUtf8Bytes("audit-pdf")
        );

        const commitHash = ethers.keccak256(
            ethers.toUtf8Bytes("commit-sha")
        );

        await contract.registerProtocolRecord(
            "ProofChain",
            "0x1234567890123456789012345678901234567890",
            "v1.0.0",
            auditHash,
            commitHash,
            "OpenZeppelin"
        );

        const history = await contract.getProtocolHistory(
            "0x1234567890123456789012345678901234567890"
        );

        expect(history.length).to.equal(1);
        expect(history[0].protocolName).to.equal("ProofChain");
        expect(history[0].version).to.equal("v1.0.0");
        expect(history[0].auditHash).to.equal(auditHash);
    });

    // =========================================================
    // SECURITY TEST
    // =========================================================

    it("should reject non-owner registration", async function () {

        const { contract, attackerContract } = await deployFixture();

        const auditHash = ethers.keccak256(
            ethers.toUtf8Bytes("audit-pdf")
        );

        const commitHash = ethers.keccak256(
            ethers.toUtf8Bytes("commit-sha")
        );

        const target = "0x9999999999999999999999999999999999999999";

        let reverted = false;
        let errorName: string | undefined;

        try {
            await attackerContract.registerProtocolRecord(
                "Hack",
                target,
                "v999",
                auditHash,
                commitHash,
                "Fake"
            );
        } catch (err: any) {
            reverted = true;

            const errorData = err?.data ?? err?.info?.error?.data;

            if (errorData) {
                try {
                    errorName = contract.interface.parseError(errorData)?.name;
                } catch {
                    // leave errorName undefined if it can't be decoded
                }
            }
        }

        expect(reverted).to.equal(true);
        if (errorName) {
            expect(errorName).to.equal("NotOwner");
        }

        // State must remain unchanged: the attacker's write must not persist.
        expect(await contract.getRecordCount(target)).to.equal(0n);
    });

    // =========================================================
    // READ EDGE CASES
    // =========================================================

    it("should revert getLatestRecord with NoRecordsFound when no records exist", async function () {

        const { contract } = await deployFixture();

        let reverted = false;
        let errorName: string | undefined;

        try {
            await contract.getLatestRecord(
                "0x1111111111111111111111111111111111111111"
            );
        } catch (err: any) {
            reverted = true;

            const errorData = err?.data ?? err?.info?.error?.data;

            if (errorData) {
                try {
                    errorName = contract.interface.parseError(errorData)?.name;
                } catch {
                    // leave errorName undefined if it can't be decoded
                }
            }
        }

        expect(reverted).to.equal(true);
        if (errorName) {
            expect(errorName).to.equal("NoRecordsFound");
        }
    });

});