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

    event Withdrawal(uint256 amount, uint256 when);

    error CannotWithdrawYet();
    error InvalidInitialUnlockTime();
    error NonOwner();

    constructor(uint64 _unlockTime) payable {
        if (block.timestamp >= _unlockTime) revert InvalidInitialUnlockTime();

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    /// @notice A withdraw function which allows withdrawal
    /// @dev Reverts if non-owner or if still locked.
    function withdraw() external {
        if (block.timestamp < unlockTime) revert CannotWithdrawYet();
        if (msg.sender != owner) revert NonOwner();

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
