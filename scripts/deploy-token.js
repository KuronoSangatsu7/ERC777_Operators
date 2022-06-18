const hre = require("hardhat");
const { singletons } = require("@openzeppelin/test-helpers");

async function main() {

    let signers = await ethers.getSigners();
    let accounts = signers.map(x => x.address); 
    
    let initialSupply = 1000;
    let defaultOperators = [];

    this.erc1820 = await singletons.ERC1820Registry(accounts[0]);

    const CheapAToken = await hre.ethers.getContractFactory("CheapAToken");
    const token = await CheapAToken.deploy(initialSupply, defaultOperators);

    await token.deployed();

    console.log("Your token has been deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
