const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("upgrade", function() {
        let attacker,deployer;
        it("should return the solved", async function(){
            [attacker,deployer] = await ethers.getSigners();

            const Setup = await ethers.getContractFactory("upgradeSetup",attacker);
            const setup = await Setup.deploy();

            await setup.upgrade();

            // const Exploit = await ethers.getContractFactory("upgradeExploit",attacker);
            // const exploit = await Exploit.deploy(setup.address);

            expect(await setup.isSolved()).to.equal(true)

        })
    }
)
