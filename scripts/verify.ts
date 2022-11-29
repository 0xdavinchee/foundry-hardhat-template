import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 * Helper function for verifying contracts.
 * @param hre Hardhat Runtime Environment
 * @param address Address of contract to verify
 * @param constructorArguments array of constructor arguments
 */
export async function verifyContract(
    hre: HardhatRuntimeEnvironment,
    address: string,
    constructorArguments: any[]
) {
    try {
        await hre.run("verify:verify", {
            address,
            constructorArguments,
        });
    } catch (err) {
        console.error(err);
    }
}
