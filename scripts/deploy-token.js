const hre = require("hardhat");
const { singletons } = require("@openzeppelin/test-helpers");

async function main() {

  let signers = await ethers.getSigners();
  let accounts = signers.map(x => x.address); 
  
  let initialSupply = 10000;
  let defaultOperators = [/* fixedPriceSeller and bulkSender*/];

  const CheapAToken = await hre.ethers.getContractFactory("CheapAToken");
  const token = await CheapAToken.deploy(initialSupply, defaultOperators);

  await token.deployed();

  console.log("CheapAToken has been deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
