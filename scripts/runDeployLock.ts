import { ethers } from "hardhat";
import { deployLock } from "./deployLock";

async function main() {
    const signer = (await ethers.getSigners())[0];
    await deployLock(signer);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
