// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SocialRecovery contract used for DeaNa APP
/// @author Julien Lampin
/// @notice This contract allow you to protect your private key (or any information) with guardians. Theses guardian will be able to unlock the secret if enough of them enable it
/// @dev Inherits the OpenZepplin Ownable implentation
contract SocialRecovery is Ownable {

    /// @notice Main struture of guardians, guardians are the protector of users and are always related to a specific user
    struct Guardian {
        address guardianAddress;
        bool isConfirmed;
        string secret;
        string unlockedSecret;

    }

    /// @notice Main struture of users
    /// @custom:name Explicit name of the user in order to show user friendly information to the guardian
    /// @custom:recoveryAddress If user lost his account and guardians launch a recovery, user will need a new address to recover
    /// @custom:shareCount When secured, indicate in how many shares the key has been dispatched
    /// @custom:threashold When secured, indicate the minimum number of shares required to unlock the main key
    struct User {
        address userAddress;
        Guardian[] guardians;
        UserAccountStatus accountStatus;
        address recoveryAddress;
        string name;
        uint shareCounts;
        uint threashold;
    }

    /// @notice UserAccountStatus indicate in which state the user account currently is
    enum UserAccountStatus {
        Init,
        Locked,
        Unlocked
    }

    /// @notice GuardianStatus indicate in which state the guardian currently is
    enum GuardianStatus {
        Pending,
        Confirmed,
        Locked,
        Unlocked
    }

    /// @notice GuardianStatus indicate in which state the guardian currently is
    event GuardianStatusChange(address userAddress, address guardianAddress, GuardianStatus statusBefore, GuardianStatus statusAfter, uint256 timestamp);
    event UserAccountStatusChange(address userAddress, UserAccountStatus statusBefore, UserAccountStatus statusAfter, uint256 timestamp);

    /// @notice Main mapping to retrieve an user using its address
    mapping (address => User) userAddressToUser;

    /// @notice Main mapping to retrieve an user using its guardianAddress
    /// @dev Assuming here (for the v1) that address can only be used to protect one account
    mapping (address => User) guardianAddressToUser;

    /// @notice Mapping linking pending recovery user to real blocked user
    mapping (address => User) recoveryUserAddressToUser;

    /*
        event VoterRegistered(address voterAddress, uint256 timestamp);
        event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus, uint256 timestamp);
        event ProposalRegistered(address userAddress, string description, uint proposalId, uint256 timestamp);
        event Voted (address voter, uint proposalId, uint256 timestamp);
    */

    /// @notice Add a new guardian for the user
    /// @param _guardianAddress address of the guardian to add
    /// @param _name name of the guardian, only used for user friendly display
    /// @dev Will be applyed to current user, if no user exist, user will be created
    function addGuardian(address _guardianAddress, string calldata _name) external{

    }

    /// @notice Revoke a guardian, removing it for user guardian list
    /// @param _guardianAddress address of the guardian to revoke
    /// @dev Allowed only if number of remaining guardian is higher or equal than threashold
    function revokeGuardian(address _guardianAddress) external{

    }

    /// @notice Return the user related to a specific guardian (Assuming here (for the v1) that address can only be used to protect one account)
    function getUserFromGuardian() external view returns(User memory){
        return guardianAddressToUser[msg.sender];
    }

    /// @notice Return the user related to a specific recovered address
    function getUserFromRecoveredAddress() external view returns(User memory){
        return recoveryUserAddressToUser[msg.sender];

    }

    /// @notice Return the user related to caller address
    function getUser() external view returns(User memory){
        return userAddressToUser[msg.sender];
    }

    /// @notice Method to retrieve guardian secret
    /// @return  The guardian related current secret (this secret is encrypt using guardian key)
    /// @dev can only be used by the guardian itself
    function getSecret() external returns(string memory){

    }

    /// @notice Confirm a guardian protection
    /// @dev can only be used by the guardian itself
    function confirmGuardian() external{

    }

    /// @notice Unlock a secret by adding the unlockedSecret to the guardian
    /// @param _recoveryUserAddress recovery address used to encrypt the unlocked secret
    /// @param unlockedSecret decrypt secret from guardian, re-encrypted with user recovery address
    /// @dev if account was in recovery we initialise the recovery mode by setting the _recoveryUserAddress
    function unlock(address _recoveryUserAddress, string calldata unlockedSecret) external{

    }

    /// @notice Lock the user account by putting shares on each guardians
    /// @param _shares parts of the secret crypted with guardian key
    /// @param threashold minimum number of shares needed to unlock the secret
    /// @dev _shares should be in the same order as guardians
    function lock(string[] calldata _shares, uint threashold) external{

    }


    /*

    // on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //

    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }

    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }


    // ::::::::::::: REGISTRATION ::::::::::::: //

    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr,block.timestamp);
    }


    // ::::::::::::: PROPOSAL ::::::::::::: //

    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        require(voters[msg.sender].proposalCount<3, 'Vous ne pouvez proposer que 3 propositions maximum');
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        voters[msg.sender].proposalCount++;
        emit ProposalRegistered(msg.sender, proposal.description, proposalsArray.length-1, block.timestamp);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found'); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id,block.timestamp);
    }

    // ::::::::::::: STATE ::::::::::::: //


    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted,block.timestamp);
    }

    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded,block.timestamp);
    }

    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted,block.timestamp);
    }

    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded,block.timestamp);
    }


    function tallyVotes() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
        uint _winningProposalId;
        for (uint256 p = 0; p < proposalsArray.length; p++) {
            if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
                _winningProposalId = p;
            }
        }
        winningProposalID = _winningProposalId;

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied,block.timestamp);
    }

    */
}