const { expect } = require("chai");
const { ethers } = require("hardhat");
const { singletons } = require("@openzeppelin/test-helpers");

describe("FixedPriceSeller", function () {

    let token, fixedPriceSeller, accounts, signers;

    beforeEach(async () => {
        signers = await ethers.getSigners();

        accounts = signers.map(x => x.address);

        const FixedPriceSeller = await ethers.getContractFactory("FixedPriceSeller");
        fixedPriceSeller = await FixedPriceSeller.deploy();
        await fixedPriceSeller.deployed();

        let initialSupply = 1000;
        let defaultOperators = [fixedPriceSeller.address];

        this.erc1820 = await singletons.ERC1820Registry(accounts[0]);

        const CheapAToken = await hre.ethers.getContractFactory("CheapAToken");
        token = await CheapAToken.deploy(initialSupply, defaultOperators);
        await token.deployed();
    });

    it("initializes successfully", async function() {
        expect(fixedPriceSeller.address).to.be.properAddress;
        expect(token.address).to.be.properAddress;
        const [fixedPriceOperator] = await token.defaultOperators();
        expect(fixedPriceOperator).to.equal(fixedPriceSeller.address);
    });

    it("sets price for a token", async function() {
        await fixedPriceSeller.setPricePerToken(token.address, ethers.utils.parseUnits("1.0"));
        let price = await fixedPriceSeller.getPricePerToken(token.address, accounts[0]);
        price = ethers.utils.formatUnits(price.toString())
        expect(price).to.equal('1.0');
    });

    it("sells tokens", async function() {
        //buying 10 tokens for 10 ether after setting the price per token to 1 ether
        await fixedPriceSeller.setPricePerToken(token.address, ethers.utils.parseUnits("1.0"));
        const value = ethers.utils.parseUnits("10");

        await fixedPriceSeller.connect(signers[1]).send(token.address, accounts[0], {value: value})

        let holderCATBalance = await token.balanceOf(accounts[0]);
        let buyerCATBalance = await token.balanceOf(accounts[1]);

        expect(holderCATBalance).to.equal('990')
        expect(buyerCATBalance).to.equal('10')
    });

    it("does not sell when a price is not set", async function() {
        const value = ethers.utils.parseUnits("10");

        await expect(fixedPriceSeller.connect(signers[1]).send(token.address, accounts[0], {value: value})).to.be.reverted;
    });

    it("does not sell when the price is set to 0", async function() {
        await fixedPriceSeller.setPricePerToken(token.address, ethers.utils.parseUnits("0"))
        const value = ethers.utils.parseUnits("10");

        await expect(fixedPriceSeller.connect(signers[1]).send(token.address, accounts[0], {value: value})).to.be.reverted;
    });

    it("does not sell when not paid", async function() {
        await fixedPriceSeller.setPricePerToken(token.address, ethers.utils.parseUnits("1.0"))
        const value = ethers.utils.parseUnits("10");

        await expect(fixedPriceSeller.connect(signers[1]).send(token.address, accounts[0])).to.be.reverted;
    });

    it("does not sell non-integer number of tokens", async function() {
        //buying tokens for 11 ether after setting the price per token to 2.5 ether
        await fixedPriceSeller.setPricePerToken(token.address, ethers.utils.parseUnits("2.5"))
        const value = ethers.utils.parseUnits("11");

        await expect(fixedPriceSeller.connect(signers[1]).send(token.address, accounts[0], {value: value})).to.be.reverted;
    });

    it("can be revoked", async function() {
        await token.revokeOperator(fixedPriceSeller.address);
        let isOperator = await token.isOperatorFor(fixedPriceSeller.address, accounts[0]);
        expect(isOperator).to.be.false;
    });

    it("does not sell after being revoked", async function() {
        await fixedPriceSeller.setPricePerToken(token.address, ethers.utils.parseUnits("1"))
        const value = ethers.utils.parseUnits("10");
        await token.revokeOperator(fixedPriceSeller.address);

        await expect(fixedPriceSeller.connect(signers[1]).send(token.address, accounts[0], {value: value})).to.be.reverted;
    });

    it("does not allow a negative price per token", async function() {
        await expect(fixedPriceSeller.setPricePerToken(token.address, ethers.utils.parseUnits("-1"))).to.be.reverted;
    });

    it("returns the list of current sellers of a token", async function () {
        await fixedPriceSeller.setPricePerToken(token.address, ethers.utils.parseUnits("1"));
        await fixedPriceSeller.connect(signers[1]).setPricePerToken(token.address, ethers.utils.parseUnits("2"));
        await fixedPriceSeller.connect(signers[2]).setPricePerToken(token.address, ethers.utils.parseUnits("3"));
        await fixedPriceSeller.connect(signers[3]).setPricePerToken(token.address, ethers.utils.parseUnits("0"));

        let currentSellersContract = await fixedPriceSeller.getCurrentSellers(token.address);
        let currentSellersManual = [accounts[0], accounts[1], accounts[2]];

        //deep equality
        expect(currentSellersContract).to.eql(currentSellersManual);
    });

    it("does not return sellers who change the price per token to 0", async function () {
        await fixedPriceSeller.setPricePerToken(token.address, ethers.utils.parseUnits("1"));
        await fixedPriceSeller.connect(signers[1]).setPricePerToken(token.address, ethers.utils.parseUnits("2"));
        await fixedPriceSeller.connect(signers[2]).setPricePerToken(token.address, ethers.utils.parseUnits("3"));
        await fixedPriceSeller.connect(signers[2]).setPricePerToken(token.address, ethers.utils.parseUnits("0"));

        let currentSellersManual = [accounts[0], accounts[1]];
        let currentSellersContract = await fixedPriceSeller.getCurrentSellers(token.address);
        
        currentSellersContract = currentSellersContract.filter(address => address != ethers.constants.AddressZero);

        expect(currentSellersManual).to.eql(currentSellersContract);
    });

});