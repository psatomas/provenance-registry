// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProtocolProvenanceRegistry {

    struct ProtocolRecord {
        string protocolName;
        address contractAddress;
        string version;
        string auditHash;
        string commitHash;
        string auditor;
        uint256 timestamp;
    }

    mapping(address => ProtocolRecord[]) private records;

    event ProtocolRegistered(
        address indexed contractAddress,
        string version,
        string auditHash,
        uint256 timestamp
    );

    function registerProtocolRecord(
        string memory protocolName,
        address contractAddress,
        string memory version,
        string memory auditHash,
        string memory commitHash,
        string memory auditor
    ) public {

        require(
            bytes(protocolName).length > 0,
            "Invalid protocol name"
        );

        require(
            contractAddress != address(0),
            "Invalid contract address"
        );

        require(
            bytes(version).length > 0,
            "Invalid version"
        );

        require(
            bytes(auditHash).length > 0,
            "Invalid audit hash"
        );

        require(
            bytes(commitHash).length > 0,
            "Invalid commit hash"
        );

        require(
            bytes(auditor).length > 0,
            "Invalid auditor"
        );

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
            version,
            auditHash,
            block.timestamp
        );
    }
}