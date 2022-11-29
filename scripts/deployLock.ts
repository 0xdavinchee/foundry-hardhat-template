import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import hre, { ethers } from "hardhat";
import { TEST_ENVIRONMENT_CONSTANTS } from "../test/TestEnvironment";
import { _console } from "../test/testHelpers";
import { verifyContract } from "./verify";

/**
 * Deploys the Lock contract for tokenAddress
 * @param signer the signer of the deployment
 * @returns deployed Lock contract
 */
export async function deployLock(signer: SignerWithAddress) {
    // verification should not happen locally or by default
    const shouldVerify =
        process.env.VERIFY_CONTRACTS === "true" ||
        (hre.network.name !== "hardhat" && hre.network.name !== "localhost");

    _console("Deploying Lock...");
    const LockFactory = await ethers.getContractFactory("Lock");

    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const unlockTime =
        currentTimestampInSeconds + TEST_ENVIRONMENT_CONSTANTS.ONE_YEAR_IN_SECS;
    const lockedAmount = ethers.utils.parseEther("1");
    const Lock = await LockFactory.connect(signer).deploy(unlockTime, {
        value: lockedAmount,
    });

    _console("Lock Deployed at:", Lock.address);

    if (shouldVerify) {
        _console("Awaiting 6 confirmations before verification...");
        await Lock.deployTransaction.wait(6);

        _console("Verifying Lock...");
        await verifyContract(hre, Lock.address, [unlockTime]);
    }
}
