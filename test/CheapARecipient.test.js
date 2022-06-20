const { expect } = require("chai");
const { ethers } = require("hardhat");
const { singletons } = require("@openzeppelin/test-helpers");

describe("CheapARecipient", function () {
    let token, recipient, signers, accounts, erc1820;
    
    beforeEach(async () => {
        signers = await ethers.getSigners();
        accounts = signers.map(x => x.address);

        const CheapARecipient = await ethers.getContractFactory("CheapARecipient");
        recipient = await CheapARecipient.deploy();
        await recipient.deployed();

        let initialSupply = 1000;
        let defaultOperators = [];

        erc1820 = await singletons.ERC1820Registry(accounts[0]);

        const CheapAToken = await hre.ethers.getContractFactory("CheapAToken");
        token = await CheapAToken.deploy(initialSupply, defaultOperators);
        await token.deployed();
    });

    it('receives from an externally owned account', async function () {
        const tokensRecipientInterfaceHash = await recipient.TOKENS_RECIPIENT_INTERFACE_HASH();

        await recipient.recipientFor(accounts[1]);
        await erc1820.setInterfaceImplementer(accounts[1], tokensRecipientInterfaceHash, recipient.address, {from: accounts[1]});

        const sendTx = await token.send(accounts[1], '10', []);
        
        await expect(sendTx)
        .to.emit(recipient, 'DoneStuff')
        .withArgs(accounts[0], accounts[0], accounts[1], '10', [], []);

        let senderBalance = await token.balanceOf(accounts[0]);
        let recipientBalance = await token.balanceOf(accounts[1]);

        senderBalance = parseInt(senderBalance);
        recipientBalance = parseInt(recipientBalance);

        expect(recipientBalance).to.equal(10);
        expect(senderBalance).to.equal(990);
    });
});