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

    // Shared decode-and-assert helper for the custom-error revert checks
    // below. Mirrors the inline decoding already used by the existing
    // "should reject non-owner registration" and "NoRecordsFound" tests.
    async function expectRevertWithError(
        contract: ProtocolContract,
        call: Promise<any>,
        expectedErrorName: string
    ) {
        let reverted = false;
        let errorName: string | undefined;

        try {
            await call;
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
            expect(errorName).to.equal(expectedErrorName);
        }
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

    // =========================================================
    // FIELD VALIDATION
    // =========================================================

    it("should revert with InvalidProtocolName for an empty protocol name", async function () {

        const { contract } = await deployFixture();

        await expectRevertWithError(
            contract,
            contract.registerProtocolRecord(
                "",
                "0x2222222222222222222222222222222222222222",
                "v1.0.0",
                ethers.keccak256(ethers.toUtf8Bytes("audit-pdf")),
                ethers.keccak256(ethers.toUtf8Bytes("commit-sha")),
                "OpenZeppelin"
            ),
            "InvalidProtocolName"
        );
    });

    it("should revert with InvalidContractAddress for the zero address", async function () {

        const { contract } = await deployFixture();

        await expectRevertWithError(
            contract,
            contract.registerProtocolRecord(
                "ProofChain",
                ethers.ZeroAddress,
                "v1.0.0",
                ethers.keccak256(ethers.toUtf8Bytes("audit-pdf")),
                ethers.keccak256(ethers.toUtf8Bytes("commit-sha")),
                "OpenZeppelin"
            ),
            "InvalidContractAddress"
        );
    });

    it("should revert with InvalidVersion for an empty version", async function () {

        const { contract } = await deployFixture();

        await expectRevertWithError(
            contract,
            contract.registerProtocolRecord(
                "ProofChain",
                "0x2222222222222222222222222222222222222222",
                "",
                ethers.keccak256(ethers.toUtf8Bytes("audit-pdf")),
                ethers.keccak256(ethers.toUtf8Bytes("commit-sha")),
                "OpenZeppelin"
            ),
            "InvalidVersion"
        );
    });

    it("should revert with InvalidAuditHash for a zero audit hash", async function () {

        const { contract } = await deployFixture();

        await expectRevertWithError(
            contract,
            contract.registerProtocolRecord(
                "ProofChain",
                "0x2222222222222222222222222222222222222222",
                "v1.0.0",
                ethers.ZeroHash,
                ethers.keccak256(ethers.toUtf8Bytes("commit-sha")),
                "OpenZeppelin"
            ),
            "InvalidAuditHash"
        );
    });

    it("should revert with InvalidCommitHash for a zero commit hash", async function () {

        const { contract } = await deployFixture();

        await expectRevertWithError(
            contract,
            contract.registerProtocolRecord(
                "ProofChain",
                "0x2222222222222222222222222222222222222222",
                "v1.0.0",
                ethers.keccak256(ethers.toUtf8Bytes("audit-pdf")),
                ethers.ZeroHash,
                "OpenZeppelin"
            ),
            "InvalidCommitHash"
        );
    });

    it("should revert with InvalidAuditor for an empty auditor", async function () {

        const { contract } = await deployFixture();

        await expectRevertWithError(
            contract,
            contract.registerProtocolRecord(
                "ProofChain",
                "0x2222222222222222222222222222222222222222",
                "v1.0.0",
                ethers.keccak256(ethers.toUtf8Bytes("audit-pdf")),
                ethers.keccak256(ethers.toUtf8Bytes("commit-sha")),
                ""
            ),
            "InvalidAuditor"
        );
    });

    // =========================================================
    // OWNERSHIP TRANSFER
    // =========================================================

    it("should allow the owner to transfer ownership", async function () {

        const { contract, attackerSigner } = await deployFixture();

        const newOwner = await attackerSigner.getAddress();

        await contract.transferOwnership(newOwner);

        expect(await contract.owner()).to.equal(newOwner);
    });

    it("should reject non-owner ownership transfer", async function () {

        const { contract, attackerContract, attackerSigner, ownerSigner } = await deployFixture();

        await expectRevertWithError(
            contract,
            attackerContract.transferOwnership(await attackerSigner.getAddress()),
            "NotOwner"
        );

        // Ownership must remain unchanged.
        expect(await contract.owner()).to.equal(
            await ownerSigner.getAddress()
        );
    });

    it("should reject transferring ownership to the zero address", async function () {

        const { contract, ownerSigner } = await deployFixture();

        let reverted = false;
        let reason: string | undefined;

        try {
            await contract.transferOwnership(ethers.ZeroAddress);
        } catch (err: any) {
            reverted = true;
            reason = err?.reason;
        }

        expect(reverted).to.equal(true);
        if (reason) {
            expect(reason).to.equal("Invalid owner");
        }

        // Ownership must remain unchanged.
        expect(await contract.owner()).to.equal(
            await ownerSigner.getAddress()
        );
    });

    // =========================================================
    // MULTIPLE RECORDS / HISTORY ORDERING
    // =========================================================

    it("should append multiple records for the same address and preserve registration order", async function () {

        const { contract } = await deployFixture();

        const target = "0x3333333333333333333333333333333333333333";

        await contract.registerProtocolRecord(
            "ProofChain",
            target,
            "v1.0.0",
            ethers.keccak256(ethers.toUtf8Bytes("audit-v1")),
            ethers.keccak256(ethers.toUtf8Bytes("commit-v1")),
            "OpenZeppelin"
        );

        await contract.registerProtocolRecord(
            "ProofChain",
            target,
            "v2.0.0",
            ethers.keccak256(ethers.toUtf8Bytes("audit-v2")),
            ethers.keccak256(ethers.toUtf8Bytes("commit-v2")),
            "OpenZeppelin"
        );

        const history = await contract.getProtocolHistory(target);

        expect(history.length).to.equal(2);
        expect(history[0].version).to.equal("v1.0.0");
        expect(history[1].version).to.equal("v2.0.0");

        expect(await contract.getRecordCount(target)).to.equal(2n);
    });

    it("should have getLatestRecord return the most recently registered version", async function () {

        const { contract } = await deployFixture();

        const target = "0x4444444444444444444444444444444444444444";

        await contract.registerProtocolRecord(
            "ProofChain",
            target,
            "v1.0.0",
            ethers.keccak256(ethers.toUtf8Bytes("audit-v1")),
            ethers.keccak256(ethers.toUtf8Bytes("commit-v1")),
            "OpenZeppelin"
        );

        await contract.registerProtocolRecord(
            "ProofChain",
            target,
            "v2.0.0",
            ethers.keccak256(ethers.toUtf8Bytes("audit-v2")),
            ethers.keccak256(ethers.toUtf8Bytes("commit-v2")),
            "OpenZeppelin"
        );

        const latest = await contract.getLatestRecord(target);

        expect(latest.version).to.equal("v2.0.0");
        expect(latest.auditHash).to.equal(
            ethers.keccak256(ethers.toUtf8Bytes("audit-v2"))
        );
    });

    // =========================================================
    // PUBLIC READ ACCESS
    // =========================================================

    it("should allow a non-owner account to read history, record count, and the latest record", async function () {

        const { contract, attackerContract } = await deployFixture();

        const target = "0x5555555555555555555555555555555555555555";

        await contract.registerProtocolRecord(
            "ProofChain",
            target,
            "v1.0.0",
            ethers.keccak256(ethers.toUtf8Bytes("audit-pdf")),
            ethers.keccak256(ethers.toUtf8Bytes("commit-sha")),
            "OpenZeppelin"
        );

        const history = await attackerContract.getProtocolHistory(target);
        const count = await attackerContract.getRecordCount(target);
        const latest = await attackerContract.getLatestRecord(target);

        expect(history.length).to.equal(1);
        expect(count).to.equal(1n);
        expect(latest.version).to.equal("v1.0.0");
    });

});