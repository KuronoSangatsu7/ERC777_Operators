const hre = require("hardhat");

async function main() {
  
  const BulkSender = await ethers.getContractFactory("BulkSender");
  const bulkSender = await BulkSender.deploy();

  await bulkSender.deployed();

  console.log("Bulk Sender has been deployed to address: ", bulkSender.address);

  const FixedPriceSeller = await ethers.getContractFactory("FixedPriceSeller");
  const fixedPriceSeller = await FixedPriceSeller.deploy();

  await fixedPriceSeller.deployed();

  console.log("Fixed Price Seller has been deployed to address: ", fixedPriceSeller.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });