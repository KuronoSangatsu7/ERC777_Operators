const { expect } = require("chai");
const { ethers } = require("hardhat");
const { singletons } = require("@openzeppelin/test-helpers");

describe("BulkSender", function () {

    let token, bulkSender, accounts;

    beforeEach(async () => {
        accounts = await ethers.getSigners();
        accounts = accounts.map(x => x.address);

        const BulkSender = await ethers.getContractFactory("BulkSender");
        bulkSender = await BulkSender.deploy();
        await bulkSender.deployed();

        let initialSupply = 1000;
        let defaultOperators = [bulkSender.address];

        this.erc1820 = await singletons.ERC1820Registry("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");

        const CheapAToken = await hre.ethers.getContractFactory("CheapAToken");
        token = await CheapAToken.deploy(initialSupply, defaultOperators);
        await token.deployed();
    });

    it("initializes successfully", async function () {
        expect(bulkSender.address).to.be.properAddress;
        expect(token.address).to.be.properAddress;
        const [bulkSendOperator] = await token.defaultOperators();
        expect(bulkSendOperator).to.equal(bulkSender.address);
    });

    it("bulk transfers the same amount", async function () {

        let recipientAddresses = accounts;
        recipientAddresses.shift();

        let recipientBalancesBefore = await Promise.all(recipientAddresses.map(async (i) => {
            let balance = new ethers.BigNumber.from(await token.balanceOf(i));
            balance = balance.toNumber();
            return balance;
        }));

        await bulkSender.send(token.address, recipientAddresses, '2', [])

        let recipientBalancesAfter = await Promise.all(recipientAddresses.map(async (i) => {
            let balance = new ethers.BigNumber.from(await token.balanceOf(i));
            balance = balance.toNumber();
            return balance;
        }));

        recipientBalancesBefore.forEach((n, index) => {
            const m = recipientBalancesAfter[index];
            expect(m).to.equal(n + 2);
        });
    });

    it("bulk transfers different amounts", async function () {

        let recipientAddresses = accounts.slice(1, 6);

        let recipientBalancesBefore = await Promise.all(recipientAddresses.map(async (i) => {
            let balance = new ethers.BigNumber.from(await token.balanceOf(i));
            balance = balance.toNumber();
            return balance;
        }));

        let amountsToSend = ['1', '2', '3', '4', '5'];

        await bulkSender.sendAmounts(token.address, recipientAddresses, amountsToSend, [])

        let recipientBalancesAfter = await Promise.all(recipientAddresses.map(async (i) => {
            let balance = new ethers.BigNumber.from(await token.balanceOf(i));
            balance = balance.toNumber();
            return balance;
        }));

        recipientBalancesBefore.forEach((n, index) => {
            const m = recipientBalancesAfter[index];
            const amount = parseInt(amountsToSend[index]);
            expect(m).to.equal(n + amount);
        });
    });
  });
  