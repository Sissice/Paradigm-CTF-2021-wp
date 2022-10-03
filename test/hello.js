const { expect } = require("chai");

describe("hello", function() {
    let attacker;
    it("should return the solved", async function(){
        [attacker] = await ethers.getSigners();

        const Setup = await ethers.getContractFactory("helloSetup",attacker);
        const setup = await Setup.deploy();

        const helloAddr = await setup.hello();
        const hello = await ethers.getContractAt("Hello", helloAddr, attacker);

        await hello.solve();
        expect(await setup.isSolved()).to.equal(true);
    })
    }
)
