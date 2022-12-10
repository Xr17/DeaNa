const SocialRecovery = artifacts.require("../contracts/SocialRecovery.sol");

const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

contract('SocialRecovery', accounts => {

    const owner = accounts[0];
    const user = accounts[0];
    const guardian1 = accounts[1];
    const guardian2 = accounts[2];
    const guardian3 = accounts[3];
    const recover = accounts[4];

    let socialRecoveryInstance;

    describe("Ownership", function () {


        it("User should be able to add guardians", async () => {
            const socialRecoveryInstance = await SocialRecovery.deployed();
            await socialRecoveryInstance.addGuardian(guardian1, "guardian1",{ from: user });
            await socialRecoveryInstance.addGuardian(guardian2, "guardian2",{ from: user });
            await socialRecoveryInstance.addGuardian(guardian3, "guardian3",{ from: user });

            var userInfo = await socialRecoveryInstance.getUser({from:user});

            expect(userInfo.guardianCount).to.equal('3');
            expect(userInfo.accountStatus).to.equal('0');
            expect(userInfo.guardians[0]).to.equal(guardian1);
            expect(userInfo.guardians[1]).to.equal(guardian2);
            expect(userInfo.guardians[2]).to.equal(guardian3);

            var guardian1Info = await socialRecoveryInstance.getGuardian(guardian1,{from:user});
            expect(guardian1Info.name).to.equal("guardian1");
            expect(guardian1Info.guardianStatus).to.equal('0');
            expect(guardian1Info.guardianAddress).to.equal(guardian1);
            expect(guardian1Info.guardianOf).to.equal(user);

            var guardian2Info = await socialRecoveryInstance.getGuardian(guardian2,{from:user});
            expect(guardian2Info.name).to.equal("guardian2");
            expect(guardian2Info.guardianStatus).to.equal('0');
            expect(guardian2Info.guardianAddress).to.equal(guardian2);
            expect(guardian2Info.guardianOf).to.equal(user);

            var guardian3Info = await socialRecoveryInstance.getGuardian(guardian3,{from:user});
            expect(guardian3Info.name).to.equal("guardian3");
            expect(guardian3Info.guardianStatus).to.equal('0');
            expect(guardian3Info.guardianAddress).to.equal(guardian3);
            expect(guardian3Info.guardianOf).to.equal(user);
        });

        it("Guardian should be able to confirm", async () => {
            const socialRecoveryInstance = await SocialRecovery.deployed();

            await socialRecoveryInstance.confirmGuardian({ from: guardian1 });
            await socialRecoveryInstance.confirmGuardian({ from: guardian2 });
            await socialRecoveryInstance.confirmGuardian({ from: guardian3 });

            var guardian1Info = await socialRecoveryInstance.getGuardian(guardian1,{from:user});
            expect(guardian1Info.guardianStatus).to.equal('1');

            var guardian2Info = await socialRecoveryInstance.getGuardian(guardian2,{from:user});
            expect(guardian2Info.guardianStatus).to.equal('1');

            var guardian3Info = await socialRecoveryInstance.getGuardian(guardian3,{from:user});
            expect(guardian3Info.guardianStatus).to.equal('1');
        });

        it("User should be able to lock its secrets", async () => {
            const socialRecoveryInstance = await SocialRecovery.deployed();

            await socialRecoveryInstance.lock(["a","b","c"],2,{ from: user });

            var guardian1Info = await socialRecoveryInstance.getGuardian({from:guardian1});
            expect(guardian1Info.secret).to.equal('a');
            expect(guardian1Info.guardianStatus).to.equal('2');

            var guardian2Info = await socialRecoveryInstance.getGuardian({from:guardian2});
            expect(guardian2Info.secret).to.equal('b');
            expect(guardian2Info.guardianStatus).to.equal('2');

            var guardian3Info = await socialRecoveryInstance.getGuardian({from:guardian3});
            expect(guardian3Info.secret).to.equal('c');
            expect(guardian3Info.guardianStatus).to.equal('2');
        });

        it("Guardian should be able to unlock its secret", async () => {
            const socialRecoveryInstance = await SocialRecovery.deployed();

            await socialRecoveryInstance.unlock(recover,"unlock_a",{ from: guardian1 });
            var guardian1Info = await socialRecoveryInstance.getGuardian(guardian1,{from:user});
            expect(guardian1Info.unlockedSecret).to.equal('unlock_a');
            expect(guardian1Info.guardianStatus).to.equal('3');
        });

        it("Recover address should be set after first unlock", async () => {
            const socialRecoveryInstance = await SocialRecovery.deployed();

            var userInfo = await socialRecoveryInstance.getUser({from:user});
            expect(userInfo.recoveryAddress).to.equal(recover);

            var recoverUserInfo = await socialRecoveryInstance.getRecoverUser({from:recover})
            console.log(recoverUserInfo);
            expect(userInfo.userAddress).to.eq(recoverUserInfo.userAddress);

        });

        it("Guardian should not be able to unlock for someone else", async () => {
            const socialRecoveryInstance = await SocialRecovery.deployed();

            await expectRevert(socialRecoveryInstance.unlock(guardian3,"unlock_b",{ from: guardian2 }), "recoveryAddress is already set to another one.");
            var guardian1Info = await socialRecoveryInstance.getGuardian(guardian1,{from:user});
            expect(guardian1Info.unlockedSecret).to.equal('unlock_a');
        });


        it("Guardian2 should be able to unlock its secret", async () => {
            const socialRecoveryInstance = await SocialRecovery.deployed();

            await socialRecoveryInstance.unlock(recover,"unlock_b",{ from: guardian2 });
            var guardian2Info = await socialRecoveryInstance.getGuardian(guardian2,{from:user});
            expect(guardian2Info.unlockedSecret).to.equal('unlock_b');
            expect(guardian2Info.guardianStatus).to.equal('3');
        });

        it("Recover user should be able to retrieve unlocked secrets", async () => {
            const socialRecoveryInstance = await SocialRecovery.deployed();

            var secrets = await socialRecoveryInstance.getUnlockedSecrets({ from: recover });

            expect(secrets[0]).to.equal('unlock_a');
            expect(secrets[1]).to.equal('unlock_b');
            expect(secrets[2]).to.equal('');
            expect(secrets[3]).to.equal('');
            expect(secrets[4]).to.equal('');
        });

        it("User should be able to reset social recovery", async () => {
            const socialRecoveryInstance = await SocialRecovery.deployed();
            await socialRecoveryInstance.reset({from:user});
            expect((await socialRecoveryInstance.getUser({ from: user })).userAddress).to.equal('0x0000000000000000000000000000000000000000');
            expect((await socialRecoveryInstance.getRecoverUser({ from: recover })).userAddress).to.equal('0x0000000000000000000000000000000000000000');
            expect((await socialRecoveryInstance.getGuardian({ from: guardian1 })).guardianAddress).to.equal('0x0000000000000000000000000000000000000000');
            expect((await socialRecoveryInstance.getGuardian({ from: guardian2 })).guardianAddress).to.equal('0x0000000000000000000000000000000000000000');
            expect((await socialRecoveryInstance.getGuardian({ from: guardian3 })).guardianAddress).to.equal('0x0000000000000000000000000000000000000000');
        });


    });


});