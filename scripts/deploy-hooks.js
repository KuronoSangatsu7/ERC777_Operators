const hre = require("hardhat");

async function main() {

  const CheapASender = await ethers.getContractFactory("CheapASender");
  const sender = await CheapASender.deploy();

  await sender.deployed();

  console.log("Sender has been deployed to address: ", sender.address);

  const CheapARecipient = await ethers.getContractFactory("CheapARecipient");
  const recipient = await CheapARecipient.deploy();
  
  await recipient.deployed();

  console.log("Recipient has been deployed to address: ", recipient.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });