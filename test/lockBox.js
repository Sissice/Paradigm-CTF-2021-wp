const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("Lockbox", function() {
    let attacker;
    it("should return the solved", async function() {
        [attacker] = await ethers.getSigners();

        const Setup = await ethers.getContractFactory("lockBoxSetup",attacker);
        const setup = await Setup.deploy();

        const Exploit = await ethers.getContractFactory("lockBoxExploit",attacker);
        const exploit = await Exploit.deploy(setup.address);

        await exploit.exploit()

        expect(await setup.isSolved()).to.equal(true)

    })
})
