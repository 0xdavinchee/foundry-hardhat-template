import {
    SnapshotRestorer,
    takeSnapshot,
    time,
} from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Lock } from "../typechain-types";

// TestEnvironment file
// - Prevents duplicated harness code across test files
// - Easy to extend and add to tests as you add new contracts/features

export const TEST_ENVIRONMENT_CONSTANTS = {
    ONE_YEAR_IN_SECS: 365 * 24 * 60 * 60,
    ONE_GWEI: 1_000_000_000,
};

export interface TestEnvironment {
    constants: typeof TEST_ENVIRONMENT_CONSTANTS;
    users: SignerWithAddress[];
    owner: SignerWithAddress; // owner
    otherAccount: SignerWithAddress; // other account
    lock: Lock;
    snapshot: SnapshotRestorer;
    lockedAmount: number;
    unlockTime: number;
}

const testEnv: TestEnvironment = {
    constants: TEST_ENVIRONMENT_CONSTANTS,
    users: [],
    owner: {} as SignerWithAddress,
    otherAccount: {} as SignerWithAddress,
    lock: {} as Lock,
    lockedAmount: 0,
    snapshot: {} as SnapshotRestorer,
    unlockTime: 0,
};

/**
 * Initializes Test Environment Object
 * - Deploys Lock contract
 */
export const initializeTestEnvironment = async () => {
    const signers = await ethers.getSigners();
    [testEnv.owner, testEnv.otherAccount] = signers;
    const lockContractFactory = await ethers.getContractFactory("Lock");

    testEnv.lockedAmount = testEnv.constants.ONE_GWEI;
    testEnv.unlockTime =
        (await time.latest()) + testEnv.constants.ONE_YEAR_IN_SECS;

    testEnv.lock = await lockContractFactory.deploy(testEnv.unlockTime, {
        value: testEnv.lockedAmount,
    });
};

export const makeSuite = (
    name: string,
    tests: (testEnvironment: TestEnvironment) => void
) => {
    describe(name, () => {
        before(async () => {
            console.log("Initializing test environment...");
            await initializeTestEnvironment();
            console.log("Test environment initialized!");
            testEnv.snapshot = await takeSnapshot();
        });

        tests(testEnv);

        beforeEach(async () => {
            await testEnv.snapshot.restore();
        });
    });
};
