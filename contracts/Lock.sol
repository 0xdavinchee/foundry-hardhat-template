// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/// @title Lock Contract
/// @author Hardhat
/// @notice A simple locking smart contract which locks a native asset and allows owners to retrieve them at a later date.
/// @dev Explain to a developer any extra details
contract Lock {
    /// @notice The timestamp in the future funds can be withdrawn
    /// @dev We use 2**64 instead of 2**256 as this should suffice for most use cases
    uint64 public unlockTime;

    /// @notice The owner of the smart contract
    /// @dev The deployer of this smart contract (non-transferable)
    address payable public owner;

    event NewOwner(address indexed oldOwner, address indexed newOwner);
    event NewUnlockTime(address indexed owner, uint64 unlockTime);
    event Withdrawal(uint256 amount);

    error CannotWithdrawYet();
    error InvalidUnlockTime();
    error NonOwner();

    constructor(uint64 _unlockTime) payable {
        if (block.timestamp >= _unlockTime) revert InvalidUnlockTime();

        unlockTime = _unlockTime;
        owner = payable(msg.sender);

        emit NewUnlockTime(msg.sender, _unlockTime);
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NonOwner();
        _;
    }

    /// @notice A withdraw function which allows withdrawal
    /// @dev Reverts if non-owner or if still locked.
    function withdraw() external onlyOwner {
        if (block.timestamp < unlockTime) revert CannotWithdrawYet();
        
        uint256 balance = address(this).balance;

        owner.transfer(balance);

        emit Withdrawal(balance);
    }

    /// @notice Sets the unlock time for the withdrawal
    /// @dev Explain to a developer any extra details
    /// @param _unlockTime The time which the lock can be unlocked
    function setUnlockTime(uint64 _unlockTime) external onlyOwner {
        if (block.timestamp >= _unlockTime) revert InvalidUnlockTime();

        unlockTime = _unlockTime;

        emit NewUnlockTime(msg.sender, _unlockTime);
    }

    /// @notice Sets the new owner/admin of the contract
    /// @dev Allow arbitrarily setting of new owner
    /// @param _newOwner The new owner of the contract
    function setNewOwner(address payable _newOwner) external onlyOwner {
        owner = _newOwner;

        emit NewOwner(msg.sender, _newOwner);
    }
}
