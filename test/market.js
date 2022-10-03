const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Market", function() {
    let attacker;
    it("should return the solved", async function() {
        [attacker] = await ethers.getSigners()

        const Setup = await ethers.getContractFactory("marketSetup",attacker);
        const setup = await Setup.deploy({
            value: ethers.utils.parseEther("50.0")
        });

        const Exploit = await ethers.getContractFactory("marketExploit",attacker);
        const exploit = await Exploit.deploy(setup.address,{
            value: ethers.utils.parseEther("70.0")
        });



        expect(await setup.isSolved()).to.equal(true)

    })
})
