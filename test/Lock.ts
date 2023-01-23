import { time } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { makeSuite, TestEnvironment } from "./TestEnvironment";

makeSuite("Lock", (testEnv: TestEnvironment) => {
    describe("Deployment", function () {
        it("Should set the right unlockTime", async function () {
            const { lock, unlockTime } = testEnv;

            expect(await lock.unlockTime()).to.equal(unlockTime);
        });

        it("Should set the right owner", async function () {
            const { lock, owner } = testEnv;

            expect(await lock.owner()).to.equal(owner.address);
        });

        it("Should receive and store the funds to lock", async function () {
            const { lock, lockedAmount } = testEnv;

            expect(await ethers.provider.getBalance(lock.address)).to.equal(
                lockedAmount
            );
        });

        it("Should fail if the unlockTime is not in the future", async function () {
            // We don't use the fixture here because we want a different deployment
            const latestTime = await time.latest();
            const Lock = await ethers.getContractFactory("Lock");
            await expect(
                Lock.deploy(latestTime, { value: 1 })
            ).to.be.revertedWithCustomError(Lock, "InvalidUnlockTime");
        });
    });

    describe("Withdrawals", function () {
        describe("Validations", function () {
            it("Should revert with the right error if called too soon", async function () {
                const { lock } = testEnv;

                await expect(lock.withdraw()).to.be.revertedWithCustomError(
                    lock,
                    "CannotWithdrawYet"
                );
            });

            it("Should revert with the right error if called from another account", async function () {
                const { lock, unlockTime, otherAccount } = testEnv;

                // We can increase the time in Hardhat Network
                await time.increaseTo(unlockTime);

                // We use lock.connect() to send a transaction from another account
                await expect(
                    lock.connect(otherAccount).withdraw()
                ).to.be.revertedWithCustomError(lock, "NonOwner");
            });

            it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
                const { lock, unlockTime } = testEnv;

                // Transactions are sent using the first signer by default
                await time.increaseTo(unlockTime);

                await expect(lock.withdraw()).not.to.be.reverted;
            });
        });

        describe("Events", function () {
            it("Should emit an event on withdrawals", async function () {
                const { lock, unlockTime, lockedAmount } = testEnv;

                await time.increaseTo(unlockTime);

                await expect(lock.withdraw())
                    .to.emit(lock, "Withdrawal")
                    .withArgs(lockedAmount); // We accept any value as `when` arg
            });
        });

        describe("Transfers", function () {
            it("Should transfer the funds to the owner", async function () {
                const { lock, unlockTime, lockedAmount, owner } = testEnv;

                await time.increaseTo(unlockTime);

                await expect(lock.withdraw()).to.changeEtherBalances(
                    [owner, lock],
                    [lockedAmount, -lockedAmount]
                );
            });
        });
    });
});
