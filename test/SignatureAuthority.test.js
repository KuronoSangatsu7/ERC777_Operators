const { expect } = require("chai");
const { ethers } = require("hardhat");
const { singletons } = require("@openzeppelin/test-helpers");
const { inTransaction } = require("@openzeppelin/test-helpers/src/expectEvent");

describe("SignatureAuthority", function () {

    let token, signatureAuthority, accounts, signers;

    beforeEach(async () => {
        signers = await ethers.getSigners();

        accounts = signers.map(x => x.address);

        const SignatureAuthority = await ethers.getContractFactory("SignatureAuthority");
        signatureAuthority = await SignatureAuthority.deploy();
        await signatureAuthority.deployed();

        let initialSupply = 1000;
        let defaultOperators = [signatureAuthority.address];

        this.erc1820 = await singletons.ERC1820Registry(accounts[0]);

        const CheapAToken = await hre.ethers.getContractFactory("CheapAToken");
        token = await CheapAToken.deploy(initialSupply, defaultOperators);
        await token.deployed();
    });

    it("allows transfers when signature is provided", async function() {
        const amount = '100';
        const hash = await signatureAuthority.hashForSend(token.address, accounts[0], accounts[1], amount, [], 1);
        const hashBinary = ethers.utils.arrayify(hash);
        const signature = await signers[0].signMessage(hashBinary);

        const sendTx = await signatureAuthority.connect(signers[3]).send(token.address, accounts[0], accounts[1], amount, [], 1, signature);
        
        const senderCATBalance = await token.balanceOf(accounts[0]);
        const recipientCATBalance = await token.balanceOf(accounts[1]);

        expect(senderCATBalance).to.equal('900');
        expect(recipientCATBalance).to.equal('100');
    });

    it("does not allow the same transfer twice", async function() {
        const amount = '100';
        const hash = await signatureAuthority.hashForSend(token.address, accounts[0], accounts[1], amount, [], 1);
        const hashBinary = ethers.utils.arrayify(hash);
        const signature = await signers[0].signMessage(hashBinary);

        const sendTx = await signatureAuthority.connect(signers[3]).send(token.address, accounts[0], accounts[1], amount, [], 1, signature);
        
        await expect(signatureAuthority.connect(signers[3]).send(token.address, accounts[0], accounts[1], amount, [], 1, signature)).to.be.reverted;
    });

    it("does not send when revoked", async function() {
        const amount = '100';
        const hash = await signatureAuthority.hashForSend(token.address, accounts[0], accounts[1], amount, [], 1);
        const hashBinary = ethers.utils.arrayify(hash);
        const signature = await signers[0].signMessage(hashBinary);

        await token.revokeOperator(signatureAuthority.address);

        await expect(signatureAuthority.connect(signers[3]).send(token.address, accounts[0], accounts[1], amount, [], 1, signature)).to.be.reverted;
    });

});