const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("Farmer", function() {
    let attacker;
    it("should return the solved", async function() {
        [attacker] = await ethers.getSigners()

        const Setup = await ethers.getContractFactory("farmerSetup",attacker);
        const setup = await Setup.deploy({
            value: ethers.utils.parseEther("50.0")
        });

        // console.log(await setup.expectedBalance())

        const Exploit = await ethers.getContractFactory("farmerExploit",attacker);
        const exploit = await Exploit.deploy(setup.address,{
            value: ethers.utils.parseEther("50.0")
        });



        expect(await setup.isSolved()).to.equal(true)

    })
})
