const hre = require("hardhat");

async function main() {
    const CheapASender = await hre.ethers.getContractFactory("CheapASender");
    const tokenSender = await CheapASender.deploy();

    await tokenSender.deployed();

    console.log("Sender has been deployed to address: ", tokenSender.address);

    const CheapARecipient = await hre.ethers.getContractFactory("CheapARecipient");
    const tokenRecipient = await CheapARecipient.deploy('0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0');

    await tokenRecipient.deployed();

    console.log("Recipient has been deployed to address: ", tokenRecipient.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });