const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Vault", function() {
    let attacker;
    it("should return the solved", async function() {
        [attacker] = await ethers.getSigners()

        const Setup = await ethers.getContractFactory("vaultSetup",attacker)
        const setup = await Setup.deploy()

        const Exploit = await ethers.getContractFactory("vaultExploit",attacker)
        const exploit = await Exploit.deploy(setup.address)

        await exploit.part1()
        await exploit.part2()
        expect(await setup.isSolved()).to.equal(true)

        // const Exploit = await ethers.getContractFactory("Solve",attacker)
        // const exploit = await Exploit.deploy()
        //
        // await exploit.doit1(setup.address)
        // await exploit.doit2(setup.address)

        // expect(await setup.isSolved()).to.equal(true)

    })
})
