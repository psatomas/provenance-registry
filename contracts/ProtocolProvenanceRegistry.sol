// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProtocolProvenanceRegistry {

    // =============================================================
    //                           ERRORS
    // =============================================================

    error NotOwner();
    error InvalidProtocolName();
    error InvalidContractAddress();
    error InvalidVersion();
    error InvalidAuditHash();
    error InvalidCommitHash();
    error InvalidAuditor();

    // =============================================================
    //                           STRUCTS
    // =============================================================

    struct ProtocolRecord {
        string protocolName;
        address contractAddress;
        string version;
        bytes32 auditHash;
        bytes32 commitHash;
        string auditor;
        uint256 timestamp;
    }

    // =============================================================
    //                           STORAGE
    // =============================================================

    address public owner;
    mapping(address => ProtocolRecord[]) private records;

    // =============================================================
    //                            EVENTS
    // =============================================================

    event ProtocolRegistered(
        address indexed contractAddress,
        bytes32 indexed auditHash,
        bytes32 indexed commitHash,
        string protocolName,
        string version,
        string auditor,
        uint256 timestamp
    );

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // =============================================================
    //                          MODIFIERS
    // =============================================================

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    // =============================================================
    //                         CONSTRUCTOR
    // =============================================================

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), owner);
    }

    // =============================================================
    //                     EXTERNAL FUNCTIONS
    // =============================================================

    function registerProtocolRecord(
        string memory protocolName,
        address contractAddress,
        string memory version,
        bytes32 auditHash,
        bytes32 commitHash,
        string memory auditor
    ) external {

        // Validation
        if (bytes(protocolName).length == 0) revert InvalidProtocolName();
        if (contractAddress == address(0)) revert InvalidContractAddress();
        if (bytes(version).length == 0) revert InvalidVersion();
        if (auditHash == bytes32(0)) revert InvalidAuditHash();
        if (commitHash == bytes32(0)) revert InvalidCommitHash();
        if (bytes(auditor).length == 0) revert InvalidAuditor();

        // Create and Store
        ProtocolRecord memory newRecord = ProtocolRecord({
            protocolName: protocolName,
            contractAddress: contractAddress,
            version: version,
            auditHash: auditHash,
            commitHash: commitHash,
            auditor: auditor,
            timestamp: block.timestamp
        });

        records[contractAddress].push(newRecord);

        emit ProtocolRegistered(
            contractAddress,
            auditHash,
            commitHash,
            protocolName,
            version,
            auditor,
            block.timestamp
        );
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    function getProtocolHistory(address contractAddress) external view returns (ProtocolRecord[] memory) {
        return records[contractAddress];
    }

    function getLatestRecord(address contractAddress) external view returns (ProtocolRecord memory) {
        require(records[contractAddress].length > 0, "No records found");
        return records[contractAddress][records[contractAddress].length - 1];
    }

    function getRecordCount(address contractAddress) external view returns (uint256) {
        return records[contractAddress].length;
    }

    // =============================================================
    //                    OWNERSHIP MANAGEMENT
    // =============================================================

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }
}