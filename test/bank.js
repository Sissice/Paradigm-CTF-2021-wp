const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("Farmer", function() {
    let attacker;
    it("should return the solved", async function() {
        [attacker] = await ethers.getSigners()

        const Setup = await ethers.getContractFactory("bankSetup",attacker);
        const setup = await Setup.deploy({
            value: ethers.utils.parseEther("50.0")
        });

        // console.log(await setup.expectedBalance())

        const Exploit = await ethers.getContractFactory("bankExploit",attacker);
        const exploit = await Exploit.deploy(setup.address);



        expect(await setup.isSolved()).to.equal(true)

    })
})
