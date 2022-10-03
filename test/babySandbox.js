const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("BabySandbox", function() {
    let attacker;
    it("should return the solved", async function() {
        [attacker] = await ethers.getSigners();

        const Setup = await ethers.getContractFactory("babySandboxSetup",attacker);
        const setup = await Setup.deploy();

        const Exploit = await ethers.getContractFactory("babySandboxExploit",attacker);
        const exploit = await Exploit.deploy(setup.address);

        expect(await setup.isSolved()).to.equal(true)

    })
})
