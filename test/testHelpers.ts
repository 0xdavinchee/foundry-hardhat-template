import { ethers } from "hardhat";

export const _console = (message?: any, ...optionalParams: any[]) => {
    if (process.env.CONSOLE_LOG) {
        optionalParams.length > 0
            ? console.log(message, ...optionalParams)
            : console.log(message);
    }
};

export const toBN = (x: any) => ethers.BigNumber.from(x);
