import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";

try {
    dotenvConfig();
} catch (error) {
    console.error(
        "Loading .env file failed. Things will likely fail. You may want to copy .env.template and create a new one."
    );
}

const config: HardhatUserConfig = {
    solidity: "0.8.17",
    paths: {
        cache: "./cache_hardhat", // Use a different cache for Hardhat than Foundry
    },
    etherscan: {
        apiKey: {
            mainnet: process.env.ETHERSCAN_API || "",
            goerli: process.env.ETHERSCAN_API || "",
        },
    },
};

export default config;
