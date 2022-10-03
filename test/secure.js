const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("secure", function() {
        let attacker,deployer;
        it("should return the solved", async function(){
            [attacker,deployer] = await ethers.getSigners();

            const WETH = await ethers.getContractAt("WETH9", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", attacker);

            const Setup = await ethers.getContractFactory("secureSetup",attacker);
            const setup = await Setup.deploy({
                value: ethers.utils.parseEther("50.0")
            });
            expect(await WETH.balanceOf(setup.address)).to.equal(0);

            await WETH.deposit({
                value: ethers.utils.parseEther("50.0")
            });

            //转账
            await WETH.transfer(setup.address,setup.WANT())
            expect(await setup.isSolved()).to.equal(true);
        })
    }
)
