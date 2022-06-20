const { expect } = require("chai");
const { ethers } = require("hardhat");
const { singletons } = require("@openzeppelin/test-helpers");

describe("CheapASender", function () {
    let token, sender, signers, accounts, erc1820;
    
    beforeEach(async () => {
        signers = await ethers.getSigners();
        accounts = signers.map(x => x.address);

        const CheapASender = await ethers.getContractFactory("CheapASender");
        sender = await CheapASender.deploy();
        await sender.deployed();

        let initialSupply = 1000;
        let defaultOperators = [];

        erc1820 = await singletons.ERC1820Registry(accounts[0]);

        const CheapAToken = await hre.ethers.getContractFactory("CheapAToken");
        token = await CheapAToken.deploy(initialSupply, defaultOperators);
        await token.deployed();
    });

    it('sends from an externally owned account', async function () {
        const tokensSenderInterfaceHash = await sender.TOKENS_SENDER_INTERFACE_HASH();
        
        await sender.senderFor(accounts[0]);
        await erc1820.setInterfaceImplementer(accounts[0], tokensSenderInterfaceHash, sender.address, {from: accounts[0]});

        const sendTx = await token.send(accounts[1], '2', []);

        await expect(sendTx)
        .to.emit(sender, 'DoneStuff')
        .withArgs(accounts[0], accounts[0], accounts[1], '2', [], []);

        let senderBalance = await token.balanceOf(accounts[0]);
        let recipientBalance = await token.balanceOf(accounts[1]);

        senderBalance = parseInt(senderBalance);
        recipientBalance = parseInt(recipientBalance);

        expect(recipientBalance).to.equal(2);
        expect(senderBalance).to.equal(998);
    });
});