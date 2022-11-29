// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "forge-std/Test.sol";
import { Lock } from "../contracts/Lock.sol";

contract LockTest is Test {
    address public alice = 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496;
    address public bob = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    Lock public lock;
    uint64 unlockTime = uint64(block.timestamp + 365 days);

    function setUp() public {
        vm.startPrank(alice);
        lock = new Lock{value: 1 ether}(unlockTime);
    }

    // Deployment Tests
    function testUnlockTimeProperlyInitialized() external {
        assertEq(lock.unlockTime(), unlockTime);
    }
    function testOwnerProperlyInitialized() external {
        assertEq(lock.owner(), alice);
    }
    function testFundsProperlySent() external {
        assertEq(address(lock).balance, 1 ether);
    }

    function testCannotSetUnlockTimeInPast(uint64 _time) external {
        vm.assume(_time < block.timestamp);
        vm.expectRevert(Lock.InvalidInitialUnlockTime.selector);
        new Lock(_time);
    }

    // Withdrawal Tests
    function testCannotWithdrawTooEarly() external {
        vm.expectRevert(Lock.CannotWithdrawYet.selector);
        lock.withdraw();
    }   
    function testCannotWithdrawAsNonOwner() external {
        vm.expectRevert(Lock.NonOwner.selector);
        vm.warp(unlockTime + 1);
        vm.stopPrank();
        vm.prank(bob);
        lock.withdraw();
    }
    // @note funky behavior due to withdrawing to LockTest
    function testCanWithdrawIfRequirementsPass() external {
        vm.warp(unlockTime);
        lock.withdraw();
    }

    // function testWithdrawalEmit() external {}
}
