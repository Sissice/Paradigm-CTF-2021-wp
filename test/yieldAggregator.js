const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("yieldAggregator", function() {
    let attacker
    it("should return the solved", async function(){
        [attacker] = await ethers.getSigners();

        const Setup = await ethers.getContractFactory("yieldSetup",attacker);
        const setup = await Setup.deploy({
            value: ethers.utils.parseEther("100.0")
        });

        // const wethAddr = await setup.weth();
        const weth = await ethers.getContractAt("WETH92", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", attacker);

        const bankAddr = await setup.bank();
        const bank = await ethers.getContractAt("MiniBank", bankAddr, attacker);

        const aggregatorAddr = await setup.aggregator();
        const aggregator = await ethers.getContractAt("YieldAggregator", aggregatorAddr, attacker);

        console.log("weth.balanceOf(bank)",await weth.balanceOf(bank.address))
        console.log("weth.balanceOf(aggregator)",await weth.balanceOf(aggregator.address))
        console.log("aggregator.poolTokens(setup.address)",await aggregator.poolTokens(setup.address))


        // const Exploit = await ethers.getContractFactory("yieldExploit",attacker);
        // const exploit = await Exploit.deploy(setup.address,{
        //     value: ethers.utils.parseEther("50.0")
        // });
        //
        // await exploit.attack()
        //
        // console.log("weth.balanceOf(bank)",await weth.balanceOf(bank.address))
        // console.log("weth.balanceOf(aggregator)",await weth.balanceOf(aggregator.address))
        // console.log("aggregator.poolTokens(setup.address)",await aggregator.poolTokens(setup.address))
        // console.log("aggregator.poolTokens(exploit.address)",await aggregator.poolTokens(exploit.address))


        const Exploit = await ethers.getContractFactory("ExploitYieldAggregator",attacker);
        const exploit = await Exploit.deploy(bank.address,aggregator.address,{
            value: ethers.utils.parseEther("50.0")
        });

        console.log("weth.balanceOf(exploit)",await weth.balanceOf(exploit.address))


        expect(await setup.isSolved()).to.equal(true)
    })
})
