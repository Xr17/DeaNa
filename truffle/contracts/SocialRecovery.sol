// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title SocialRecovery contract used for DeaNa APP
/// @author Julien Lampin
/// @notice This contract allow you to protect your private key (or any information) with guardians. Theses guardian will be able to unlock the secret if enough of them enable it
/// @dev Inherits the OpenZepplin Ownable implentation
contract SocialRecovery is Ownable {

    /// @notice Main struture of guardians, guardians are the protector of users and are always related to a specific user
    struct Guardian {
        address guardianAddress;
        address guardianOf;
        string secret;
        string unlockedSecret;
        GuardianStatus guardianStatus;
        string name;
    }

    /// @notice Main struture of users
    /// @custom:name Explicit name of the user in order to show user friendly information to the guardian
    /// @custom:recoveryAddress If user lost his account and guardians launch a recovery, user will need a new address to recover
    /// @custom:shareCount When secured, indicate in how many shares the key has been dispatched
    /// @custom:threashold When secured, indicate the minimum number of shares required to unlock the main key
    struct User {
        address userAddress;
        address[] guardians;
        uint guardianCount;
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
        PendingUnlock,
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
    mapping (address => User) users;

    /// @notice Main mapping to retrieve an user using its guardian address
    mapping (address => Guardian) guardians;

    /// @notice Main mapping to retrieve an user using its recover address
    mapping (address => User) recoveryUsers;


    modifier onlyUsers() {
        require(users[msg.sender].userAddress == msg.sender, "You're not a user");
        _;
    }

    modifier onlyRecoverUsers() {
        require(recoveryUsers[msg.sender].recoveryAddress == msg.sender, "You're not a user");
        _;
    }

    modifier onlyGuardians() {
        require(guardians[msg.sender].guardianAddress == msg.sender, "You're not a guardian");
        _;
    }

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
        // Simplification here, user can only be guardian of one person
        require(guardians[_guardianAddress].guardianAddress != _guardianAddress, "This address is already used as a guardian");

        if(users[msg.sender].userAddress != msg.sender){
            initUser();
        }

        User storage user = users[msg.sender];
        for(uint i = 0 ; i < user.guardianCount ; i++){
            if(user.guardians[i] == _guardianAddress){
                revert("Guardian already exists.");
            }
        }

        guardians[_guardianAddress] = Guardian({
        name:_name,
        guardianAddress : _guardianAddress,
        guardianStatus: GuardianStatus.Pending,
        secret : "",
        guardianOf: msg.sender,
        unlockedSecret: ""
        });

        user.guardians[users[msg.sender].guardianCount++] = _guardianAddress;
    }


    function initUser() private {
        users[msg.sender] = User({
        userAddress : msg.sender,
        guardians: new address[](5), // simplification, only 5 guardians allowed
        guardianCount: 0,
        accountStatus : UserAccountStatus.Init,
        recoveryAddress : address(0),
        name : "",
        shareCounts : 0,
        threashold : 0
        });
    }
    function reset() onlyUsers external{
        User memory user = users[msg.sender];

        for(uint i = 0 ; i < user.guardianCount ; i++){
            delete guardians[user.guardians[i]];
        }
        delete recoveryUsers[user.recoveryAddress];
        delete users[msg.sender];
    }

    /// @notice Revoke a guardian, removing it for user guardian list
    /// @param _guardianAddress address of the guardian to revoke
    /// @dev Allowed only if number of remaining guardian is higher or equal than threashold
    function revokeGuardian(address _guardianAddress) onlyUsers external{
        User storage user = users[msg.sender];
        bool guardianFound = false;
        for(uint i = 0 ; i < user.guardianCount ; i++){
            if(guardianFound){
                user.guardians[i-1] = user.guardians[i];
            }
            if(user.guardians[i] == _guardianAddress){
                user.guardians[i] = address(0);
                delete guardians[_guardianAddress];
                guardianFound = true;
            }
        }
        if(guardianFound){
            user.guardians[user.guardianCount-1] = address(0);
            user.guardianCount--;
        }
    }

    /// @notice Return the user related to a specific guardian (Assuming here (for the v1) that address can only be used to protect one account)
    /// @return User that sender address is protecting
    function getProtectedUser() external view returns(User memory){
        return users[guardians[msg.sender].guardianOf];
    }

    /// @notice Return the user related to a specific recovered address
    function getRecoverUser() external view returns(User memory){
        return recoveryUsers[msg.sender];
    }

    /// @notice Return the user related to caller address
    function getUser() external view returns(User memory){
        return users[msg.sender];
    }

    function getGuardian(address _guardianAddress) external view returns(Guardian memory){
        return guardians[_guardianAddress];
    }

    function getGuardian() external view returns(Guardian memory){
        return guardians[msg.sender];
    }

    /// @notice Method to retrieve guardian secret
    /// @return  The guardian related current secret (this secret is encrypt using guardian key)
    /// @dev can only be used by the guardian itself
    function getUnlockedSecrets() external onlyRecoverUsers view returns(string[] memory){

        User memory user = recoveryUsers[msg.sender];
        string[] memory secrets = new string[](5);

        for(uint i = 0 ; i < user.guardianCount ; i++){
            if(guardians[user.guardians[i]].guardianStatus == GuardianStatus.Unlocked){
                secrets[i] =guardians[user.guardians[i]].unlockedSecret;
            }
        }
        return secrets;
    }

    /// @notice Confirm a guardian protection
    /// @dev can only be used by the guardian itself
    function confirmGuardian() onlyGuardians external{
        require(guardians[msg.sender].guardianStatus == GuardianStatus.Pending, "You are not pending protect");

        guardians[msg.sender].guardianStatus = GuardianStatus.Confirmed;
    }

    /// @notice Unlock a secret by adding the unlockedSecret to the guardian
    /// @param _recoveryUserAddress recovery address used to encrypt the unlocked secret
    /// @param unlockedSecret decrypt secret from guardian, re-encrypted with user recovery address
    /// @dev if account was in recovery we initialise the recovery mode by setting the _recoveryUserAddress
    function unlock(address _recoveryUserAddress, string calldata unlockedSecret) onlyGuardians external{
        require(guardians[msg.sender].guardianStatus == GuardianStatus.Locked, "You are not protecting any secret");
        require(users[guardians[msg.sender].guardianOf].recoveryAddress == address(0) || users[guardians[msg.sender].guardianOf].recoveryAddress == _recoveryUserAddress, "recoveryAddress is already set to another one");

        if(users[guardians[msg.sender].guardianOf].recoveryAddress == address(0)){
            users[guardians[msg.sender].guardianOf].recoveryAddress = _recoveryUserAddress;
            recoveryUsers[_recoveryUserAddress] = users[guardians[msg.sender].guardianOf];
            users[guardians[msg.sender].guardianOf].accountStatus=UserAccountStatus.PendingUnlock;
        }

        guardians[msg.sender].guardianStatus = GuardianStatus.Unlocked;
        guardians[msg.sender].unlockedSecret = unlockedSecret;

    }

    /// @notice Lock the user account by putting shares on each guardians
    /// @param _shares parts of the secret crypted with guardian key
    /// @param threashold minimum number of shares needed to unlock the secret
    /// @dev _shares should be in the same order as guardians
    function lock(string[] calldata _shares, uint threashold) onlyUsers external{
        require(_shares.length >= threashold, "threashold should be less of equals than shares number");
        require(users[msg.sender].guardianCount == _shares.length, "You should have the same number of guardians and shares");
        require(users[msg.sender].guardianCount >= threashold, "You don't have enough guardians");


        uint guardianCount = users[msg.sender].guardianCount;
        for(uint i = 0 ; i <guardianCount ; i++){
            address guardianAddress = users[msg.sender].guardians[i];
            require(guardians[guardianAddress].guardianStatus != GuardianStatus.Pending, "A guardian is not confirmed");
            guardians[guardianAddress].guardianStatus = GuardianStatus.Locked;
            guardians[guardianAddress].secret = _shares[i];
        }
    users[msg.sender].accountStatus = UserAccountStatus.Locked;
    }

}