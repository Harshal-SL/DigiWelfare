// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ApplicationLog {
    struct Application {
        string applicationId;
        string schemeName;
        string applicantName;
        string applicantEmail;
        uint256 timestamp;
        string status;
        bytes32 documentHash; // Hash of all documents
    }

    mapping(string => Application) public applications;
    string[] public applicationIds;
    address public owner;

    event ApplicationLogged(
        string applicationId,
        string schemeName,
        string applicantName,
        uint256 timestamp,
        string status
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function logApplication(
        string memory _applicationId,
        string memory _schemeName,
        string memory _applicantName,
        string memory _applicantEmail,
        bytes32 _documentHash,
        string memory _status
    ) public onlyOwner {
        require(bytes(applications[_applicationId].applicationId).length == 0, "Application already exists");

        Application memory newApplication = Application({
            applicationId: _applicationId,
            schemeName: _schemeName,
            applicantName: _applicantName,
            applicantEmail: _applicantEmail,
            timestamp: block.timestamp,
            status: _status,
            documentHash: _documentHash
        });

        applications[_applicationId] = newApplication;
        applicationIds.push(_applicationId);

        emit ApplicationLogged(
            _applicationId,
            _schemeName,
            _applicantName,
            block.timestamp,
            _status
        );
    }

    function getApplication(string memory _applicationId) public view returns (
        string memory applicationId,
        string memory schemeName,
        string memory applicantName,
        string memory applicantEmail,
        uint256 timestamp,
        string memory status,
        bytes32 documentHash
    ) {
        Application memory app = applications[_applicationId];
        require(bytes(app.applicationId).length > 0, "Application not found");
        
        return (
            app.applicationId,
            app.schemeName,
            app.applicantName,
            app.applicantEmail,
            app.timestamp,
            app.status,
            app.documentHash
        );
    }

    function getAllApplicationIds() public view returns (string[] memory) {
        return applicationIds;
    }

    function updateApplicationStatus(string memory _applicationId, string memory _newStatus) public onlyOwner {
        require(bytes(applications[_applicationId].applicationId).length > 0, "Application not found");
        applications[_applicationId].status = _newStatus;
    }
} 